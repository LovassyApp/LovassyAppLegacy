<?php

namespace App\Http\Controllers;

use App\Exceptions\AuthErrorException;
use App\Helpers\LibCrypto\Models\MasterKey;
use App\Helpers\LibCrypto\Models\SodiumKeypair;
use App\Helpers\LibCrypto\Services\EncryptionManager;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Helpers\LibSession\AuthCookie;
use App\Helpers\LibSession\Services\SessionManager;
use Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'exists:users'],
            'password' => ['required', 'max:255', 'string'],
        ]);

        $cookie = (bool) $request->remember ?? false;

        return $this->doLogin($cookie, $data);
    }

    private function doLogin(bool $remember, array $data)
    {
        if (Auth::attempt($data)) {
            $user = User::where('id', Auth::user()->id)
                ->setEagerLoads([])
                ->first();
            $token = SessionManager::start();

            $key = new MasterKey($user->master_key_encrypted);
            $key->unlock($data['password'], SessionManager::use()->session()->user_salt);

            EncryptionManager::use()->setMasterKey($key);

            if ($remember) {
                $authCookie = AuthCookie::make($data['email'], $data['password']);
            } else {
                $authCookie = AuthCookie::forget();
            }

            return response()
                ->json(
                    [
                        'result' => 'success',
                        'status' => 200,
                        'message' => 'Login successful',
                        'user' => $user,
                        'token' => $token,
                        'remember_token' => $authCookie->rawBody ?? '',
                    ],
                    200
                )
                ->withCookie($authCookie);
        } else {
            throw new AuthErrorException('Bad credentials');
        }
    }

    /*
        Na akkor kérem.
        Ez lehet, hogy túlkomplikált, viszont! Garantálja a biztonságtot
    */
    public function register(Request $request)
    {
        $data = $request->validate(
            [
                // 'Korlátok korláta'
                // De azért jobb a békesség
                'email' => ['required', 'string', 'email', 'max:255', 'regex:/(.*)lovassy\.edu\.hu$/i', 'unique:users'],
                'password' => ['required', 'max:255', 'string'],

                // La kréta
                'name' => ['required', 'string', 'max:255'],
                'om_code' => ['required', 'string', 'max:20'],
                // Nem volt jobb üzenet ötletem. Don't @ me.
            ],
            [
                'email.regex' => "Registration is only allowed for 'lovassy.edu.hu' E-mail addresses.",
            ]
        );

        // kíjdzsen hax klikbéjt jutúb tutoriál ikszdé
        $salt = EncryptionManager::generateSalt();
        $key = new MasterKey();
        $stored_key = $key->lock($data['password'], $salt);
        $man = EncryptionManager::boot_register($key);
        $keys = new SodiumKeypair(null);

        // Akkor ez most egy júzer???? Igen.
        $user = new User([
            'name' => $data['name'],
            'password' => Hash::make($data['password']),
            'email' => $data['email'],
            'om_code_hashed' => EncryptionManager::hash_general($data['om_code']),
            'om_code_encrypted' => $man->encrypt($data['om_code']),
            'public_key_hex' => $keys->publicKey_hex,
            'master_key_encrypted' => $stored_key,
            'private_key_encrypted' => $man->encrypt($keys->privateKey),
        ]);
        $user->save();
        $user->groups()->sync([1]);

        EncryptionManager::saveSalt($salt, $user->id);

        // Szépségességes dzséjszon response
        return response()->json(
            [
                'result' => 'success',
                'message' => 'User successfully created.',
            ],
            200
        );
    }

    /*
        Cookie-val való bejelentkezés
        Weben password remember opció cucc
    */
    public function loginWithCookie(Request $request)
    {
        /*
            Rendes remember token query param-ként
        */
        $encrypted = $request->cookie('blueboard_refresh', null) ?? ($request->query('token', null) ?? false);

        if ($encrypted == false) {
            throw new AuthErrorException('Auth cookie not set.');
        }

        $val = AuthCookie::parse($encrypted);

        if (!isset($val->username) || !isset($val->password)) {
            throw new AuthErrorException('Invalid cookie / token.');
        }

        $data = Validator::validate(
            ['email' => $val->username, 'password' => $val->password],
            [
                'email' => ['required', 'string', 'email', 'max:255', 'exists:users'],
                'password' => ['required', 'max:255', 'string'],
            ]
        );

        return $this->doLogin(true, $data);
    }

    public function destroyCookie()
    {
        $authCookie = AuthCookie::forget();
        return response()
            ->json(
                [
                    'result' => 'success',
                    'message' => 'Cookie destroyed!',
                ],
                200
            )
            ->withCookie($authCookie);
    }
}

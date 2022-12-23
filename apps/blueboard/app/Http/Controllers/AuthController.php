<?php

namespace App\Http\Controllers;

use App\Exceptions\AuthErrorException;
use App\Helpers\LibCrypto\Models\MasterKey;
use App\Helpers\LibCrypto\Models\SodiumKeypair;
use App\Helpers\LibCrypto\Services\EncryptionManager;
use App\Helpers\LibCrypto\Services\HashManager;
use App\Helpers\LibRefresh\AuthCookie;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Helpers\LibSession\Services\SessionManager;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $data = $request->safe();

        $cookie = (bool) $request->remember ?? false;

        return $this->doLogin($cookie, $data->toArray());
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
                $authCookie = AuthCookie::make($data['password']);
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
                        'remember_token_expiry' => $authCookie->expires_at ?? '',
                    ],
                    200
                )
                ->withCookie($authCookie);
        } else {
            throw ValidationException::withMessages(['email' => 'Invalid credentials supplied']);
        }
    }

    /*
        Na akkor kérem.
        Ez lehet, hogy túlkomplikált, viszont! Garantálja a biztonságtot
    */
    public function register(RegisterRequest $request)
    {
        $data = $request->safe();

        // kíjdzsen hax klikbéjt jutúb tutoriál ikszdé
        $salt = EncryptionManager::generateSalt();
        $hasher_salt = EncryptionManager::generateSalt();
        $key = new MasterKey();
        $stored_key = $key->lock($data['password'], $salt);
        $man = EncryptionManager::boot_register($key);
        $keys = new SodiumKeypair(null);

        try {
            // Akkor ez most egy júzer???? Igen.
            $user = new User([
                'name' => $data['name'],
                'password' => Hash::make($data['password']),
                'email' => $data['email'],
                'om_code_hashed' => HashManager::hash($data['om_code']),
                'om_code_encrypted' => $man->encrypt($data['om_code']),
                'public_key_hex' => $keys->publicKey_hex,
                'master_key_encrypted' => $stored_key,
                'private_key_encrypted' => $man->encrypt($keys->privateKey),
                'hasher_salt_encrypted' => $man->encrypt($hasher_salt),
                'hasher_salt_hashed' => HashManager::hash($hasher_salt),
            ]);
            $user->save();
            $user->groups()->sync([1]);

            EncryptionManager::saveSalt($salt, $user->id);
        } catch (\Exception $ex) {
            throw $ex;
        }

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
        $token = $request->cookie('blueboard_refresh', null) ?? ($request->query('token', null) ?? false);

        if ($token == false) {
            throw new AuthErrorException('Auth cookie not set.');
        }

        $val = AuthCookie::getPassword($token);

        $data = Validator::validate(
            ['email' => $val['email'], 'password' => $val['password']],
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

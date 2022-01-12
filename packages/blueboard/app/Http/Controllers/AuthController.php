<?php

namespace App\Http\Controllers;

use App\Exceptions\AuthErrorException;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Helpers\LibSession\Crypter;
use App\Helpers\LibSession\SessionManager;
use App\Helpers\LibKreta\KretaTokenHelper;
use App\Helpers\LibSession\AuthCookie;
use Http;

class AuthController extends Controller
{
    /*
        Bejelentkezősdi
    */
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'exists:users'],
            'password' => ['required', 'max:255', 'string'],
        ]);

        if (Auth::attempt($data)) {
            $token = SessionManager::start();
            SessionManager::setKey($data['password']);

            $cookie = (bool) $request->remember ?? false;

            if ($cookie) {
                $authCookie = AuthCookie::make($data['email'], $data['password']);
            } else {
                $authCookie = AuthCookie::forget();
            }

            return response()
                ->json(
                    [
                        'result' => 'success',
                        'message' => 'Login successful',
                        'user' => User::where('id', Auth::user()->id)
                            ->setEagerLoads([])
                            ->first(),
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
                'kreta_username' => ['required', 'string', 'max:255'],
                'kreta_password' => ['required', 'string', 'max:255'],
                // Nem volt jobb üzenet ötletem. Don't @ me.
            ],
            [
                'email.regex' => "Registration is only allowed for 'lovassy.edu.hu' E-mail addresses.",
            ]
        );

        // kíjdzsen hax klikbéjt jutúb tutoriál ikszdé
        $password = $data['password'];
        $key = Crypter::generateKey($password);

        // wut? hes?
        $data['password'] = Hash::make($password);

        // Akkor ez most egy júzer???? Igen.
        $user = new User($data);

        // Krétát veriFIKÁlni, és elmenteni titkosítva -> Chain of trust kezdete
        KretaTokenHelper::registerUserKreta($user, $data['kreta_username'], $data['kreta_password'], $key);

        $user->groups()->sync([1]);

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
        $encrypted = $request->cookie('llgapp_auth', null) ?? ($request->query('token', null) ?? false);

        if ($encrypted == false) {
            throw new AuthErrorException('Auth cookie not set.');
        }

        $val = AuthCookie::parse($encrypted);

        if (!isset($val->username) || !isset($val->password)) {
            throw new AuthErrorException('Invalid cookie.');
        }

        $response = Http::post('http://172.128.3.3/api/login', [
            'email' => $val->username,
            'password' => $val->password,
            'remember' => true,
        ]);

        return $response;
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

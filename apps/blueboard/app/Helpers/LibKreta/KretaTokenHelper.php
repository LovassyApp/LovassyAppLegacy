<?php

namespace App\Helpers\LibKreta;

use App\Exceptions\LibKreta\NotAStudentException;
use App\Helpers\LibSession\SessionManager;
use App\Helpers\LibKreta\Auth;
use App\Models\User;
use App\Helpers\LibKreta\KretaEncrypter;

class KretaTokenHelper
{
    private static string $studentRole = 'Tanulo';

    public static function renewToken()
    {
        $crypt = SessionManager::getKretaEncrypter();
        $creds = $crypt->getCreds();

        $auth = new Auth(config('app.institute_code'), $creds->username, $creds->password);
        $res = $auth->login();

        $crypt->update(
            (object) [
                'token' => $res->access_token,
                'refreshToken' => $res->refresh_token,
            ]
        );
        return $res->access_token;
    }

    public static function getCurrentToken()
    {
        $crypt = SessionManager::getKretaEncrypter();
        $creds = $crypt->getCreds();

        return $creds->token;
    }

    /*
        Túlkomplikált fos. Need I say more?
    */

    public static function registerUserKreta(
        User $user,
        string $username,
        string $password,
        string $encryptionKey,
        string $salt
    ) {
        $auth = Auth::verifyCredentials($username, $password);
        $tokenAttributes = $auth->decoded->attributes;

        // Emberünk tanuló -e?
        if ($tokenAttributes->role != self::$studentRole) {
            // Ha nem, az szopó (meg amúgy hibát dob)
            throw new NotAStudentException();
        }

        // Ha minden ok, menteni az JÚZERT
        $user->save();

        // Menteni a kréta adatokat saját kulccsal
        $crypt = new KretaEncrypter($encryptionKey, $user);
        $crypt->store($username, $password);
        $crypt->update(
            (object) [
                'token' => $auth->access_token,
                'refreshToken' => $auth->refresh_token,
            ]
        );

        // Ha emberünk esetleg névtelen hős, akkor nevet néki!
        if ($user->name == null) {
            $user->name = $tokenAttributes->name;
            $user->save();
        }
    }
}

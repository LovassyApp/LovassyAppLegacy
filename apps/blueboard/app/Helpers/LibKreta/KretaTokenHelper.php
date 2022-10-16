<?php

namespace App\Helpers\LibKreta;

use App\Exceptions\LibKreta\KretaCredentialException;
use App\Exceptions\LibKreta\KretaGeneralException;
use App\Exceptions\LibKreta\KretaTokenException;
use App\Exceptions\LibKreta\NotAStudentException;
use App\Models\User;
use Exception;

/**
 * Random kicsi függvények, tokenekkel való szenvedést egyszerűsítik meg (kicsit)
 */
class KretaTokenHelper
{
    /**
     * @var string
     */
    private static string $studentRole = 'Tanulo';

    /**
     * Megújítja a KRÉTA access tokent, majd titkosítja és elmenti
     *
     * @throws KretaTokenException
     * @throws KretaGeneralException
     * @throws KretaCredentialException
     * @throws Exception
     */
    public static function renewToken()
    {
        $crypt = KretaEncrypter::use();
        $creds = $crypt->getCreds();

        $auth = new Auth(config('kreta.institute_code'), $creds->username, $creds->password);
        $res = $auth->login();

        $crypt->update(
            (object) [
                'token' => $res->access_token,
                'refreshToken' => $res->refresh_token,
            ]
        );
        return $res->access_token;
    }

    /**
     * Jelenlegi érvényes KRÉTA access token
     *
     * @throws KretaCredentialException
     * @throws Exception
     */
    public static function getCurrentToken()
    {
        $crypt = KretaEncrypter::use();
        $creds = $crypt->getCreds();

        return $creds->token;
    }

    /**
     * Túlkomplikált fos. Need I say more?
     *
     * @throws KretaTokenException
     * @throws KretaCredentialException
     * @throws NotAStudentException
     * @throws KretaGeneralException
     */
    public static function registerUserKreta(User $user, string $username, string $password, string $encryptionKey)
    {
        $auth = Auth::verifyCredentials($username, $password);
        $tokenAttributes = $auth->decoded->attributes;
        //dd($auth);

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

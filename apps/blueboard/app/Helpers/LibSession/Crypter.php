<?php

namespace App\Helpers\LibSession;

use App\Models\Salt;
use Illuminate\Encryption\Encrypter;

/**
 * Titikosítást segítő szarságok
 */
class Crypter
{
    /**
     * @return string
     * Új salt generálás
     * _ Só (trédmárk) _
     */
    public static function generateSalt(): string
    {
        return base64_encode(openssl_random_pseudo_bytes(16));
    }

    /**
     * Felhasználóhoz kapcsolódó salt
     * @param int $userID
     * @return string
     */
    public static function getUserSalt(int $userID): string
    {
        $saltRecord = Salt::where('user_id', $userID)->firstOrFail();
        return $saltRecord->value;
    }

    /**
     * Salt mentése a DB-be
     *
     * @param string $salt
     * @param int $userID
     * @return true
     */
    public static function saveSalt(string $salt, int $userID): bool
    {
        $saltRecord = new Salt();
        $saltRecord->value = $salt;
        $saltRecord->user_id = $userID;
        $saltRecord->save();

        return true;
    }

    /**
     * Hasheli az AuthToken-t, később kulcsként van használva
     *
     * @param string $token
     * @return string
     */
    public static function makeTokenHash(string $token): string
    {
        $arr = explode('|', $token);
        return hash('sha256', $arr[1]);
    }

    /**
     * Jelszó titkosítása
     *
     * @param string $password
     * @param string $token
     * @param string $salt
     * @return string
     */
    public static function makeEncryptedPassword(string $password, string $token, string $salt): string
    {
        $key = self::generateKey($token, $salt);
        $enc = new Encrypter($key, 'aes-256-gcm');

        return $enc->encrypt($password);
    }

    /**
     * 32 karakteres kulcs generálás stringből
     * * _Konkrétan csak egy fancy hash_
     *
     * @param string $string
     * @param string $salt
     * @return string
     *
     */
    public static function generateKey(string $string, string $salt): string
    {
        return hash_pbkdf2('sha3-256', $string, $salt, 1000, 32);
    }

    /**
     * Kulcs, ami oldja a KRÉTÁS titkosított adatokat
     * * _Vagy éppenséggel NEM lol_
     *
     * @param string $str
     * @param string $token
     * @param string $salt
     * @param string $userSalt
     * @return string
     */
    public static function getUserKey(string $str, string $token, string $salt, string $userSalt): string
    {
        $key = self::generateKey($token, $salt);
        $enc = new Encrypter($key, 'aes-256-gcm');

        $password = $enc->decrypt($str);
        return self::generateKey($password, $userSalt);
    }
}

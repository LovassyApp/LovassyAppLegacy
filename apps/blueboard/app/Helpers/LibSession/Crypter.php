<?php

namespace App\Helpers\LibSession;

use Illuminate\Encryption\Encrypter;

/**
 * Titikosítást segítő szarságok
 */
class Crypter
{
	/**
	 * @param string $string
	 * @return string
	 *
	 * 32 karakteres kulcs generálás stringből
	 * _Konkrétan csak egy fancy hash_
	 */
	public static function generateKey(string $string): string
	{
		return hash_pbkdf2('sha3-256', $string, config('app.key'), 1000, 32);
	}

	/**
	 * @param string $password
	 * @param string $token
	 * @return string
	 *
	 * Jelszó titkosítása
	 */
	public static function makeEncryptedPassword(string $password, string $token): string
	{
		$key = self::generateKey($token);
		$enc = new Encrypter($key, 'aes-256-gcm');

		return $enc->encrypt($password);
	}

	/**
	 * @param string $str
	 * @param $token
	 * @return string
	 *
	 * Kulcs, ami oldja a KRÉTÁS titkosított adatokat
	 * Vagy éppenséggel NEM lol
	 */
	public static function getUserKey(string $str, $token): string
	{
		$key = self::generateKey($token);
		$enc = new Encrypter($key, 'aes-256-gcm');

		$password = $enc->decrypt($str);
		return self::generateKey($password);
	}
}

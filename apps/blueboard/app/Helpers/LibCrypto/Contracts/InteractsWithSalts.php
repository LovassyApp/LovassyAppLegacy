<?php

namespace App\Helpers\LibCrypto\Contracts;

use App\Models\Salt;

trait InteractsWithSalts
{
    public static int $SALT_LENGTH = 16;

    /**
     * Új salt generálás
     *
     * *Só (trédmárk)*
     * @return string
     */
    public static function generateSalt(): string
    {
        return bin2hex(openssl_random_pseudo_bytes(self::$SALT_LENGTH));
    }

    /**
     * Felhasználóhoz kapcsolódó salt
     * @param int $userID
     * @return string
     */
    public static function getSalt(int $userID): string
    {
        $saltRecord = Salt::where('user_id', $userID)->firstOrFail();
        return $saltRecord->value;
    }

    /**
     * Salt mentése a DB-be
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
}

<?php

namespace App\Helpers\LibCrypto\Contracts;

use App\Models\Salt;

trait InteractsWithSalts
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
    public static function getSalt(int $userID): string
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
}

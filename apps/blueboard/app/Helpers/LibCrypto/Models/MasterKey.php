<?php

namespace App\Helpers\LibCrypto\Models;

use App\Helpers\LibCrypto\Errors\KeyNotLockedException;
use App\Helpers\LibCrypto\Errors\MasterKeyLockedException;
use App\Helpers\LibCrypto\Services\EncryptionManager;
use Illuminate\Encryption\Encrypter;

class MasterKey
{
    private string|null $key_encrypted = null;
    private string $key;
    private bool $unlocked = false;

    private static int $length = 32;
    private static string $cipher = 'aes-256-gcm';

    private static function generate(): string
    {
        return openssl_random_pseudo_bytes(self::$length);
    }

    public function __construct(string|null $key_encrypted = null)
    {
        if ($key_encrypted === null) {
            $this->unlocked = true;
            $this->key = self::generate();
        } else {
            $this->unlocked = false;
            $this->key_encrypted = $key_encrypted;
        }
    }

    public function lock(string $password, string $salt): string
    {
        if (!$this->unlocked) {
            throw new MasterKeyLockedException();
        }

        $enc_key = EncryptionManager::generateBasicKey($password, $salt);
        $enc = new Encrypter($enc_key, self::$cipher);
        $this->key_encrypted = $enc->encryptString(base64_encode($this->key));
        return $this->key_encrypted;
    }

    public function unlock(string $password, string $salt): void
    {
        if ($this->key_encrypted === null) {
            throw new KeyNotLockedException();
        }
        $enc = new Encrypter(EncryptionManager::generateBasicKey($password, $salt), self::$cipher);
        $this->key = base64_decode($enc->decryptString($this->key_encrypted));
        $this->unlocked = true;
    }

    public function key(): string
    {
        if (!$this->unlocked) {
            throw new MasterKeyLockedException();
        }

        return $this->key;
    }
}

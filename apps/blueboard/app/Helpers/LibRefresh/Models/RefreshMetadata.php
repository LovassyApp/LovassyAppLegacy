<?php

namespace App\Helpers\LibRefresh\Models;

use App\Helpers\LibCrypto\Services\EncryptionManager;
use App\Helpers\LibCrypto\Services\HashManager;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Encryption\Encrypter;

class RefreshMetadata extends Model
{
    use \Spiritix\LadaCache\Database\LadaCacheTrait;
    use HasFactory;
    protected $fillable = ['salt', 'password_encrypted'];

    public static function encryptWithToken(string $token, string $payload, string $salt): string
    {
        $key = HashManager::generateBasicKey($token, $salt);
        $encrypter = new Encrypter($key, EncryptionManager::DEFAULT_CIPHER);
        return $encrypter->encryptString($payload);
    }

    public static function decryptWithToken(string $token, string $ciphertext, string $salt): string
    {
        $key = HashManager::generateBasicKey($token, $salt);
        $encrypter = new Encrypter($key, EncryptionManager::DEFAULT_CIPHER);
        return $encrypter->decryptString($ciphertext);
    }
}

<?php

namespace App\Helpers\LibCrypto\Services;

use App\Helpers\LibCrypto\Contracts\InteractsWithSalts;
use App\Helpers\LibCrypto\Errors\NoMasterKeySetException;
use App\Helpers\LibCrypto\Models\MasterKey;
use App\Helpers\LibSession\Services\SessionManager;
use Illuminate\Encryption\Encrypter;

class EncryptionManager
{
    public const DEFAULT_CIPHER = 'aes-256-gcm';
    private const KEYGEN_HASH_ALGO = 'sha3-256';
    private const DEFAULT_HASH_ALGO = 'sha512';
    private const GENERAL_HASH_ALGO = 'sha256';
    private const MASTERKEY_KEY = 'master_key';

    use InteractsWithSalts;

    private string|null $master_key = null;
    private SessionManager|null $session_manager = null;
    private Encrypter|null $encrypter = null;

    private array $hash_cache = [];

    public function __construct(SessionManager $session_manager, MasterKey|null $key = null)
    {
        $this->session_manager = $session_manager;

        if (!is_null($key)) {
            $this->master_key = $key->key();
            $this->bootEncrypter();
        }

        if ($this->session_manager->active() && is_null($key)) {
            $this->master_key = $this->session_manager->decrypt(self::MASTERKEY_KEY);
            $this->bootEncrypter();
        }
    }

    public static function boot_register(MasterKey $key): self
    {
        return new self(SessionManager::use(), $key);
    }

    private function bootEncrypter(): void
    {
        if ($this->master_key !== null) {
            $this->encrypter = new Encrypter($this->master_key, self::DEFAULT_CIPHER);
        }
    }

    public function setMasterKey(MasterKey $key): void
    {
        if ($this->session_manager->active()) {
            $this->master_key = $key->key();
            $this->session_manager->encrypt(self::MASTERKEY_KEY, $this->master_key);
            $this->bootEncrypter();
        }
    }

    public function encrypt(mixed $value, bool $serialize = true): string
    {
        if ($this->master_key === null) {
            throw new NoMasterKeySetException();
        }
        return $this->encrypter->encrypt($value, $serialize);
    }

    public function decrypt(string $payload, bool $unserialize = true): mixed
    {
        if ($this->master_key === null) {
            throw new NoMasterKeySetException();
        }
        return $this->encrypter->decrypt($payload, $unserialize);
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
    public static function generateBasicKey(string $payload, string $salt): string
    {
        return hash_pbkdf2(self::KEYGEN_HASH_ALGO, $payload, $salt, 1000, 32);
    }

    public function hash(string $payload, string $prefix = 'null'): string
    {
        if ($this->master_key === null) {
            throw new NoMasterKeySetException();
        }
        if (array_key_exists($payload, $this->hash_cache)) {
            return $this->hash_cache[$prefix . '_' . $payload];
        } else {
            $hashed = hash(self::DEFAULT_HASH_ALGO, "$this->master_key.$payload");
            $this->hash_cache[$prefix . '_' . $payload] = $hashed;
            return $hashed;
        }
    }

    public static function hash_general(string $payload): string
    {
        return hash(self::GENERAL_HASH_ALGO, $payload);
    }

    public function getKey(): string
    {
        return $this->master_key;
    }

    public static function use(): self
    {
        return app(self::class);
    }
}

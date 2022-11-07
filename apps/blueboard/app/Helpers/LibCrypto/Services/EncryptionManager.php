<?php

namespace App\Helpers\LibCrypto\Services;

use App\Helpers\LibCrypto\Contracts\InteractsWithSalts;
use App\Helpers\LibCrypto\Errors\NoMasterKeySetException;
use App\Helpers\LibCrypto\Models\MasterKey;
use App\Helpers\LibSession\Services\SessionManager;
use Illuminate\Encryption\Encrypter;
/**
 * Mesterkulcsos globális titkosító singleton
 *
 * *Remek négyszavas magyarázata ennek a clusterfucknak. Gratula Mate*
 */
class EncryptionManager
{
    /**
     * Default algoritmus / cipher titkosításhoz
     */
    public const DEFAULT_CIPHER = 'aes-256-gcm';
    /**
     * Default hashelő algoritmus kulcsok generálására
     */
    private const KEYGEN_HASH_ALGO = 'sha3-256';
    /**
     * Default hash algoritmus kulcsos hashelésre
     */
    private const DEFAULT_HASH_ALGO = 'sha512';
    /**
     * Default hash algoritmus belsőlegxd
     */
    private const GENERAL_HASH_ALGO = 'sha256';
    /**
     * Session-ben tárolt mesterkulcs neve
     */
    private const MASTERKEY_KEY = 'master_key';

    use InteractsWithSalts;

    /**
     * Mesterkulcs plaintextben
     *
     * @var string|null
     */
    private string|null $master_key = null;
    /**
     * SessionManager instance
     *
     * @var SessionManager|null
     */
    private SessionManager|null $session_manager = null;
    /**
     * Beépített, belsőleg használt Illuminate Encrypter instance
     *
     * @var Encrypter|null
     */
    private Encrypter|null $encrypter = null;
    /**
     * Kulccsal generált hashek cachelve
     *
     * *kibaszott sokat gyorsít btw*
     *
     * @var array
     */
    private array $hash_cache = [];

    /**
     * Konsztráktor?
     *
     * @param SessionManager $session_manager
     * @param MasterKey|null|null $key
     * Ha nincs kulcs megadva, akkor megpróbálja a Sessionből feloldani
     */
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

    /**
     * Regisztrálás során használt ideiglenes boot
     *
     * @param MasterKey $key
     * @return self
     */
    public static function boot_register(MasterKey $key): self
    {
        return new self(SessionManager::use(), $key);
    }

    /**
     * Titkosító bootstrap
     *
     * @return void
     */
    private function bootEncrypter(): void
    {
        if ($this->master_key !== null) {
            $this->encrypter = new Encrypter($this->master_key, self::DEFAULT_CIPHER);
        }
    }

    /**
     * Mesterkulcs beállítása kívülről egy meglévő instansnak
     *
     * @param MasterKey $key
     * @return void
     */
    public function setMasterKey(MasterKey $key): void
    {
        if ($this->session_manager->active()) {
            $this->master_key = $key->key();
            $this->session_manager->encrypt(self::MASTERKEY_KEY, $this->master_key);
            $this->bootEncrypter();
        }
    }

    /**
     * Adott üzenet titkosítása
     *
     * @param mixed $value
     * @param boolean $serialize
     * Akaródol-e *sorosítást* xd
     * @return string
     */
    public function encrypt(mixed $value, bool $serialize = true): string
    {
        if ($this->master_key === null) {
            throw new NoMasterKeySetException();
        }
        return $this->encrypter->encrypt($value, $serialize);
    }

    /**
     * Adott üzenet visszafejtése
     *
     * @param string $payload
     * @param boolean $unserialize
     * *Sorosítva* volt -e az üzenet eredetileg
     * @return mixed
     */
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

    /**
     * Kulccsal hashelő függvény
     *
     * *Kes meg mindenis*
     * @param string $payload
     * @param string $prefix
     * @return string
     */
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

    /**
     * Hashelés, kulcs nélkül
     *
     * @param string $payload
     * @return string
     */
    public static function hash_general(string $payload): string
    {
        return hash(self::GENERAL_HASH_ALGO, $payload);
    }

    /**
     * Kulcs accessor, mert szegény privátxd
     *
     * @return string
     */
    public function getKey(): string
    {
        return $this->master_key;
    }

    /**
     * A jelenleg regisztrált singleton-t adja vissza
     *
     * @return self
     */
    public static function use(): self
    {
        return app(self::class);
    }
}

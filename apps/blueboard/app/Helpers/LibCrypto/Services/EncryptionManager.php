<?php

namespace App\Helpers\LibCrypto\Services;

use App\Helpers\LibCrypto\Contracts\InteractsWithSalts;
use App\Helpers\LibCrypto\Errors\NoMasterKeySetException;
use App\Helpers\LibCrypto\Models\MasterKey;
use App\Helpers\LibSession\Services\SessionManager;
use App\Helpers\Shared\Interfaces\AbstractSingleton;
use Illuminate\Encryption\Encrypter;
/**
 * Mesterkulcsos globális titkosító singleton
 *
 * *Remek négyszavas magyarázata ennek a clusterfucknak. Gratula Mate*
 */
class EncryptionManager extends AbstractSingleton
{
    /**
     * Default algoritmus / cipher titkosításhoz
     */
    public const DEFAULT_CIPHER = 'aes-256-gcm';

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
     * Kulcs accessor, mert szegény privátxd
     *
     * @return string
     */
    public function getKey(): string
    {
        return $this->master_key;
    }

    public function active(): bool
    {
        return $this->master_key !== null;
    }

    public static function use(): self
    {
        return app(self::class);
    }
}

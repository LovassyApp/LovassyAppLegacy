<?php

namespace App\Helpers\LibCrypto\Models;

use App\Helpers\LibCrypto\Errors\KeyNotLockedException;
use App\Helpers\LibCrypto\Errors\MasterKeyLockedException;
use App\Helpers\LibCrypto\Interfaces\EncryptableKeyInterface;
use App\Helpers\LibCrypto\Services\HashManager;
use Illuminate\Encryption\Encrypter;

/**
 * Mesterkulcs, a Blueboard titkosító-motorjának az alapja
 *
 * *Ezmiez?*
 */
class MasterKey implements EncryptableKeyInterface
{
    /**
     * A kulcs titkosított formája
     *
     * @var string|null
     */
    private string|null $key_encrypted = null;

    /**
     * Maga a kulcs
     *
     * @var string
     */
    private string $key;

    /**
     * Azt mutatja hogy a kulcs fel van -e oldva
     *
     * @var boolean
     */
    private bool $unlocked = false;

    /**
     * Default kulcshossz
     *
     * @var integer
     */

    private static int $length = 32;
    /**
     * Alap cipher algoritmus a kulcs titkosításához
     *
     * @var string
     */
    private static string $cipher = 'aes-256-gcm';

    /**
     * Generál egy új kulcsot, teljesen random byte-okból, default kulcshosszal
     *
     * @return string
     */
    private static function generate(): string
    {
        return openssl_random_pseudo_bytes(self::$length);
    }

    /**
     * Konsztráktor
     *
     * @param string|null|null $key_encrypted
     * Kulcs titkosított formája. Ha nincs megadva, akkor új kulcsot generál
     */
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

    /**
     * "Zárolja" (titkosítja) a kulcsot egy adott jelszó-salt kombóval, default cipherrel
     *
     * @param string $password
     * @param string $salt
     * @return string
     */
    public function lock(string $password, string $salt): string
    {
        if (!$this->unlocked) {
            throw new MasterKeyLockedException();
        }

        $enc_key = HashManager::generateBasicKey($password, $salt);
        $enc = new Encrypter($enc_key, self::$cipher);
        $this->key_encrypted = $enc->encryptString(base64_encode($this->key));
        return $this->key_encrypted;
    }
    /**
     * "Feloldja" (visszafejti) a kulcsot, a beállított jelszó-salt kombóból
     *
     * @param string $password
     * @param string $salt
     * @return void
     */
    public function unlock(string $password, string $salt): void
    {
        if ($this->key_encrypted === null) {
            throw new KeyNotLockedException();
        }
        $enc = new Encrypter(HashManager::generateBasicKey($password, $salt), self::$cipher);
        $this->key = base64_decode($enc->decryptString($this->key_encrypted));
        $this->unlocked = true;
    }

    /**
     * Getter a kulcshoz, mivel szegény privát
     *
     * *jajxd*
     *
     * @return string
     */
    public function key(): string
    {
        if (!$this->unlocked) {
            throw new MasterKeyLockedException();
        }

        return $this->key;
    }
}

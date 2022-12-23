<?php

namespace App\Helpers\LibCrypto\Services;

use App\Helpers\LibCrypto\Errors\HashManagerInactiveException;
use App\Helpers\LibCrypto\Errors\InvalidSaltValueException;
use App\Helpers\LibSession\Services\SessionManager;
use App\Helpers\Shared\Interfaces\AbstractSingleton;
use App\Models\User;
use Exception;

class HashManager extends AbstractSingleton
{
    /**
     * Default hash algoritmus kulcsok generálására
     */
    private const KEYGEN_HASH_ALGO = 'sha3-256';

    /**
     * Default hash algoritmus saltos hashelésre
     */
    private const SALTED_HASH_ALGO = 'sha512';

    /**
     * Default hash algoritmus belsőlegxd
     */
    private const DEFAULT_HASH_ALGO = 'sha256';

    /**
     * A jelenleg használt EncryptionManager instance
     *
     * @var EncryptionManager
     */
    private EncryptionManager $encryption_manager;

    /**
     * A jelenleg használt SessionManager instance
     *
     * @var SessionManager
     */
    private SessionManager $session_manager;

    /**
     * A jelenleg bejelentkezett felhasználó
     *
     * @var User
     */
    private User $user;

    /**
     * A cache-elt user salt
     *
     * @var string|null
     */
    private string|null $user_salt_cached = null;

    /**
     * Saltal generált hashek cachelve
     *
     * *kibaszott sokat gyorsít btw*
     *
     * @var array
     */
    private array $hash_cache = [];

    /**
     * Konsztráktor ikszdé
     *
     * @param EncryptionManager $encryption_manager
     * EncryptionManager singleton (vagy más)
     * @param SessionManager $session_manager
     * SessionManager singleton (vagy más)
     */
    public function __construct(EncryptionManager $encryption_manager, SessionManager $session_manager)
    {
        $this->encryption_manager = $encryption_manager;
        $this->session_manager = $session_manager;

        if ($this->session_manager->active() && $this->encryption_manager->active()) {
            $this->active = true;
            $this->user = SessionManager::user();
        }
    }

    /**
     * A Salt visszafejtése, cache-elése
     *
     * @return void
     */
    private function loadSalt(): void
    {
        if (!$this->active()) {
            throw new HashManagerInactiveException();
        }

        try {
            $this->user_salt_cached = $this->encryption_manager->decrypt($this->user->hasher_salt_encrypted) ?? null;
            if (is_null($this->user_salt_cached)) {
                throw new Exception('lol');
            }
        } catch (\Exception $exception) {
            throw new InvalidSaltValueException();
        }

        return;
    }

    /**
     * Saltal hashelő függvény
     *
     * *Kes meg mindenis*
     * @param string $payload
     * @param string $prefix
     * @return string
     */
    public function hash_salted(string $payload, string $prefix = 'null'): string
    {
        if ($this->user_salt_cached === null) {
            $this->loadSalt();
        }

        if (array_key_exists("$prefix:$payload", $this->hash_cache)) {
            return $this->hash_cache["$prefix:$payload"];
        } else {
            $hashed = hash(self::SALTED_HASH_ALGO, "$this->user_salt_cached:$payload");
            $this->hash_cache["$prefix:$payload"] = $hashed;
            return $hashed;
        }
    }

    /**
     * Hashelés, kulcs nélkül
     *
     * @param string $payload
     * @return string
     */
    public static function hash(string $payload): string
    {
        return hash(self::DEFAULT_HASH_ALGO, $payload);
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

    public static function use(): self
    {
        return app(self::class);
    }
}

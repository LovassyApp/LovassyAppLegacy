<?php

namespace App\Helpers\LibSession;

use App\Exceptions\LibSession\SessionAlreadyStartedException;
use App\Exceptions\LibSession\SessionNotFoundException;
use App\Exceptions\LibSession\TokenMissingException;
use App\Exceptions\LibSession\UserNotLoggedInException;
use App\Helpers\LibKreta\KretaEncrypter;
use App\Models\PersonalAccessToken;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

/**
 * Session kezelő helper
 *
 * Felkészülni: Kurva hosszú
 *
 * De komolyan
 */
class SessionManager
{
    /**
     * @var string|null
     */
    private string|null $token = null;
    /**
     * @var Session|null
     */
    private Session|null $session = null;
    /**
     * @var KretaEncrypter|null
     */
    private KretaEncrypter|null $encrypter = null;
    /**
     * @var string|null
     */
    private string|null $key = null;
    /**
     * @var string|null
     */
    private string|null $userHash = null;

    /**
     * @throws TokenMissingException
     * @throws Exception
     * Konsztráktor (kell a humor ide kérem)
     */
    public function __construct()
    {
        $this->token = $this->getAuthToken();
        if ($this->token != null) {
            $this->init();
            $this->cacheKey();
            $this->cacheHash();
            $this->loadKretaCredHelper();
        }
    }

    /**
     * @return string|null
     * Ha van AuthToken a header-ben, akkor kiszedi
     */
    private function getAuthToken(): string|null
    {
        $request = request();
        $arr = explode(' ', $request->header('Authorization') ?? '');
        return $arr[1] ?? null;
    }

    /**
     * @throws TokenMissingException
     * @throws SessionNotFoundException
     * Visszatölti a meglévő sessiont. Ha valami hiba van, azt a Session automatikusan dobja.
     */
    private function init(): void
    {
        $hash = Crypter::makeTokenHash($this->token);

        if (!PersonalAccessToken::where('token', $hash)->exists()) {
            throw new TokenMissingException('Unauthorized.');
        }

        $this->session = new Session($hash);
    }

    /**
     * @return void
     * @throws Exception Jelszót kiszedi a sessionből, ebből lesz a kulcs, ami oldja a krétás adatokat
     */
    private function cacheKey(): void
    {
        if ($this->session == null) {
            throw new Exception('Session not set.');
        }

        $password = $this->session->password;

        if (!isset($password)) {
            throw new Exception('Session key not set.');
        }

        $this->key = Crypter::getUserKey($password, $this->token, $this->session->salt, $this->session->userSalt);
    }

    private function cacheHash(): void
    {
        $id = Auth::user()->id;
        $this->userHash = hash('sha512', "$this->key.$id");
    }

    /**
     * @throws Exception
     * Betölti a KRÉTA titkosítót, hogy ne kelljen többször
     */
    private function loadKretaCredHelper(): void
    {
        $this->encrypter = new KretaEncrypter($this->key);
    }

    /**
     * @return mixed
     * @throws SessionAlreadyStartedException
     * @throws UserNotLoggedInException
     */
    public static function start(): string
    {
        $sesman = app(SessionManager::class);
        if ($sesman->token != null) {
            throw new SessionAlreadyStartedException();
        }

        if (Auth::user() == null) {
            throw new UserNotLoggedInException();
        }

        return $sesman->startSession();
    }

    /**
     * @return string
     * Token-t generál, session-t a Tokenhez.
     * @throws SessionNotFoundException
     */
    private function startSession(): string
    {
        $name = Str::random(6);
        $user = self::user();
        $tokenObj = $user->createToken($name);
        $this->token = $tokenObj->plainTextToken;
        $expiry = strtotime('+30 minutes', strtotime($tokenObj->accessToken->created_at));

        $hash = Crypter::makeTokenHash($this->token);

        $this->session = Session::start($hash);
        $this->session->expiry = $expiry;
        $this->session->salt = Crypter::generateSalt();
        $this->session->userSalt = Crypter::getUserSalt($user->id);

        return $this->token;
    }

    // Innentől Statikus accessorok, Singleton-t használnak

    public static function user(): User|null
    {
        return Auth::user();
    }

    /**
     * @param string $password
     */
    public static function setKey(string $password)
    {
        $sesman = app(SessionManager::class);

        $sesman->setSessionKey($password);
    }

    /**
     * @param string $password
     * @throws Exception
     * Jelszó titkosítva a sessionben
     * Biztonság miatt csak a jelenlegi session token-je oldja, ez csak hashelt formában tárolt -> Chain of trust
     */
    private function setSessionKey(string $password): void
    {
        if ($this->session == null) {
            throw new Exception('Session not set.');
        }

        $this->session->password = Crypter::makeEncryptedPassword($password, $this->token, $this->session->salt);
    }

    /**
     * @return string
     */
    public static function getKey(): string
    {
        $sesman = app(SessionManager::class);

        return $sesman->key;
    }

    /**
     * @return string
     */
    public static function getUserHash(): string
    {
        $sesman = app(SessionManager::class);

        return $sesman->userHash;
    }

    /**
     * @param int $id
     * @return string
     */
    public static function makeHashedID(int $id): string
    {
        $sesman = app(SessionManager::class);

        return hash('sha512', "$sesman->key.$id");
    }

    /**
     * @return mixed
     */
    public static function getSession(): Session
    {
        $sesman = app(SessionManager::class);

        return $sesman->session;
    }

    /**
     * @return mixed
     * @throws Exception
     */
    public static function getKretaEncrypter(): KretaEncrypter
    {
        $sesman = app(SessionManager::class);

        if ($sesman->encrypter == null) {
            throw new Exception('No encrypter defined.');
        }

        return $sesman->encrypter;
    }
}

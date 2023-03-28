<?php

namespace App\Helpers\LibSession\Services;

use App\Helpers\LibSession\Errors\SessionAlreadyStartedException;
use App\Helpers\LibSession\Errors\SessionNotFoundException;
use App\Helpers\LibSession\Errors\TokenMissingException;
use App\Helpers\LibSession\Errors\UserNotLoggedInException;
use App\Helpers\LibCrypto\Services\EncryptionManager;
use App\Helpers\LibCrypto\Services\HashManager;
use App\Helpers\LibSession\Models\Session;
use App\Helpers\Shared\Interfaces\AbstractSingleton;
use App\Models\PersonalAccessToken;
use App\Models\User;
use Exception;
use Illuminate\Encryption\Encrypter;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

/**
 * Session kezelő helper
 *
 * Felkészülni: lolwat?
 *
 * De komolyan
 */
class SessionManager extends AbstractSingleton
{
    /**
     * Hasheli az AuthToken-t, később kulcsként van használva
     *
     * @param string $token
     * @return string
     */
    private static function makeTokenHash(string $token): string
    {
        $arr = explode('|', $token);
        return hash('sha256', $arr[1]);
    }

    /**
     * Authentikációs token. Globális request-ből lopva btw
     *
     * @var string|null
     */
    private string|null $token = null;
    /**
     * Beépített titkosító (Illuminate Encrypter instance)
     *
     * @var Encrypter|null
     */
    private Encrypter|null $encrypter = null;
    /**
     * Session instance
     *
     * @var Session|null
     */
    private Session|null $session = null;

    /**
     * Konsztráktor (kell a humor ide kérem)
     *
     * @throws TokenMissingException
     * @throws Exception
     */
    public function __construct()
    {
        $this->token = $this->getAuthToken();

        if ($this->token != null) {
            $this->init();
            $this->bootEncrypter();
            $this->active = true;
        }
    }

    /**
     * Ha van AuthToken a header-ben, akkor kiszedi
     * @return string|null
     */
    private function getAuthToken(): string|null
    {
        $request = request();
        $arr = explode(' ', $request->header('Authorization') ?? '');
        return $arr[1] ?? null;
    }

    /**
     * Visszatölti a meglévő sessiont. Ha valami hiba van, azt a Session automatikusan dobja.
     *
     * @throws TokenMissingException
     * @throws SessionNotFoundException
     */
    private function init(): void
    {
        $hash = self::makeTokenHash($this->token);

        if (!PersonalAccessToken::where('token', $hash)->exists()) {
            throw new TokenMissingException('Unauthorized.');
        }

        $this->session = new Session($hash);
    }

    /**
     * Titkosítás bootstrapizé
     *
     * @return void
     */
    private function bootEncrypter(): void
    {
        $this->encrypter = new Encrypter(
            HashManager::generateBasicKey($this->token, $this->session->salt),
            EncryptionManager::DEFAULT_CIPHER
        );
    }

    /**
     * Token-t generál, session-t a Tokenhez.
     *
     * @return string
     * @throws SessionNotFoundException
     */
    private function startSession(): string
    {
        $name = Str::random(6);
        $user = self::user();
        $tokenObj = $user->createToken($name);
        $this->token = $tokenObj->plainTextToken;
        $expiry = strtotime('+30 minutes', strtotime($tokenObj->accessToken->created_at));

        $hash = self::makeTokenHash($this->token);

        $this->session = Session::start(
            $hash,
            $expiry,
            EncryptionManager::generateSalt(),
            EncryptionManager::getSalt($user->id)
        );

        $this->bootEncrypter();
        $this->active = true;

        return $this->token;
    }

    /**
     * Titkosítás Session specifikus kulccsal
     *
     * @param string $name
     * @param mixed $value
     * @return void
     */
    public function encrypt(string $name, mixed $value): void
    {
        if ($this->encrypter === null) {
            throw new SessionNotFoundException();
        }

        $this->session->$name = $this->encrypter->encrypt($value, true);
    }

    /**
     * Visszafejtés Session specifikus kulccsal
     *
     * @param string $name
     * @return mixed
     */
    public function decrypt(string $name): mixed
    {
        if ($this->encrypter === null) {
            throw new SessionNotFoundException();
        }

        $val = $this->session()->$name;
        if (!isset($val)) {
            return null;
        }

        return $this->encrypter->decrypt($val, true);
    }

    // Innentől Statikus accessorok, Singleton-t használnak

    /**
     * Bejelentkeztetett júzer
     *
     * *kell a kurva strict tájpolás*
     *
     * @return User|null
     */
    public static function user(): User|null
    {
        return Auth::user();
    }

    /**
     * Jelenleg regisztrált SessionManager Singleton
     *
     * @return self
     */
    public static function use(): static
    {
        return app(self::class);
    }

    /**
     * Új Session-t indít, üresen
     *
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
     * Jelenleg regisztrált Singleton-hoz tartozó Session
     *
     * @return Session
     */
    public static function session(): Session
    {
        $sesman = app(SessionManager::class);

        return $sesman->session;
    }
}

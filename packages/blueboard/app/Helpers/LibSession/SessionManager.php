<?php

namespace App\Helpers\LibSession;

use App\Exceptions\LibSession\UserNotLoggedInException;
use App\Exceptions\LibSession\SessionAlreadyStartedException;
use App\Exceptions\LibSession\TokenMissingException;
use Exception;
use Illuminate\Support\Facades\Auth;
use App\Helpers\LibSession\Session;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Helpers\LibKreta\KretaEncrypter;

/**
 * Session kezelő helper
 * Felkészülni: Kurva hosszú
 * De komolyan
 */
class SessionManager
{
	/**
	 * @var string|null
	 */
	private string|null $token = null;
	/**
	 * @var \App\Helpers\LibSession\Session|null
	 */
	private Session|null $session = null;
	/**
	 * @var KretaEncrypter|null
	 */
	private KretaEncrypter|null $encrypter = null;

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
	 * Visszatölti a meglévő sessiont. Ha valami hiba van, azt a Session automatikusan dobja.
	 */
	private function init()
	{
		$hash = $this->makeTokenHash($this->token);

		if (
			!DB::table('personal_access_tokens')
				->where('token', $hash)
				->exists()
		) {
			throw new TokenMissingException('Unauthorized.');
		}

		$this->session = new Session($hash);
	}

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
			$this->loadKretaCredHelper();
		}
	}

	/**
	 * @throws Exception
	 * Betölti a KRÉTA titkosítót, hogy ne kelljen többször
	 */
	private function loadKretaCredHelper()
	{
		$key = $this->getSessionKey();
		$this->encrypter = new KretaEncrypter($key);
	}

	/**
	 * @param string $token
	 * @return false|string
	 * Hasheli az AuthToken-t, később kulcsként van használva
	 */
	private function makeTokenHash(string $token): string
	{
		$arr = explode('|', $token);
		return hash('sha256', $arr[1]);
	}

	/**
	 * @return string|null
	 * Token-t generál, session-t a Tokenhez.
	 */
	private function startSession(): string
	{
		$name = Str::random(6);
		$user = Auth::user();
		$tokenObj = $user->createToken($name);
		$this->token = $tokenObj->plainTextToken;
		$expiry = strtotime('+30 minutes', strtotime($tokenObj->accessToken->created_at));

		$hash = $this->makeTokenHash($this->token);

		$this->session = Session::start($hash);
		$this->session->expiry = $expiry;

		return $this->token;
	}

	/**
	 * @param string $password
	 * @throws Exception
	 * Jelszó titkosítva a sessionben
	 * Biztonság miatt csak a jelenlegi session token-je oldja, ez csak hashelt formában tárolt -> Chain of trust
	 */
	private function setSessionKey(string $password)
	{
		if ($this->session == null) {
			throw new Exception('Session not set.');
		}

		$this->session->password = Crypter::makeEncryptedPassword($password, $this->token);
	}

	/**
	 * @return string
	 * @throws Exception
	 * Jelszót kiszedi a sessionből, ebből lesz a kulcs, ami oldja a krétás adatokat
	 */
	private function getSessionKey(): string
	{
		if ($this->session == null) {
			throw new Exception('Session not set.');
		}

		$password = $this->session->password;

		if (!isset($password)) {
			throw new Exception('Session key not set.');
		}

		return Crypter::getUserKey($password, $this->token);
	}

	// Innentől Statikus accessorok, Singleton-t használnak

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
	 * @param string $password
	 */
	public static function setKey(string $password)
	{
		$sesman = app(SessionManager::class);

		$sesman->setSessionKey($password);
	}

	/**
	 * @return string
	 */
	public static function getKey(): string
	{
		$sesman = app(SessionManager::class);

		return $sesman->getSessionKey();
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

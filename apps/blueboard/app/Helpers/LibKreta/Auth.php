<?php

namespace App\Helpers\LibKreta;

use App\Exceptions\LibKreta\KretaCredentialException;
use App\Exceptions\LibKreta\KretaTokenException;
use Exception;

class Auth extends BaseKreta
{
	private $instituteCode;
	private $username;
	private $password;
	public $body;

	public function __construct($instituteCode, $username, $password)
	{
		parent::__construct();
		$this->instituteCode = $instituteCode;
		$this->username = $username;
		$this->password = $password;
	}

	// Kedves kréta, a kurva anyátokat
	// Üdvözlettel: Egy ember, akinek ezt a szart vissza kellett fejteni
	private function encodeNonce($username, $instituteCode)
	{
		// Normál GET request minden nélkül
		$nonce = $this->getNonceReq($this->url($this->instituteCode, 'auth', $this->endpoints->idp->nonce));

		// Pfujgec
		$message = strtolower($username) . strtolower($instituteCode) . $nonce;

		// ezt át kellene rakni valahova máshova lol
		// Thx filc
		$key = '5Kmpmgd5fJ';

		// La elbaszott hmac hash
		$sign = hash_hmac('sha512', $message, $key, true);
		$base64 = base64_encode($sign);

		return [
			'X-AuthorizationPolicy-Nonce' => $nonce,
			'X-AuthorizationPolicy-Key' => $base64,
			/*
                Ugye nem lesz több verzió?
                Ugye nem
                NE
            */
			'X-AuthorizationPolicy-Version' => 'v1',
		];
	}

	public function login()
	{
		$form = [
			'username' => $this->username,
			'password' => $this->password,
			'institute_code' => $this->instituteCode,
			'grant_type' => 'password',
			'client_id' => $this->clientID,
		];

		$headers = $this->encodeNonce($this->username, $this->instituteCode);
		$url = $this->url($this->instituteCode, 'auth', $this->endpoints->idp->token);

		$req = $this->makePostRequest($url, $form, $headers);
		$body = json_decode($req->body());
		$this->body = $body;

		if (!isset($body->access_token) && !isset($body->error_description)) {
			throw new KretaTokenException($req->body());
		}

		// életkedvnövelés kell most pls ide
		if (isset($body->access_token)) {
			$this->body->decoded = $this->decodeToken($body->access_token);
		}

		return $this->body;
	}

	/*
        Ez nem megy, IDK miert, de most nem fogok vele szenvedni
        TODO: Ezt actually működésre bírni
    */

	public function refreshToken(string $refreshToken)
	{
		$form = [
			'refresh_token' => $refreshToken,
			'institute_code' => $this->instituteCode,
			'grant_type' => 'refresh_token',
			'client_id' => $this->clientID,
		];

		$headers = $this->encodeNonce($this->username, $this->instituteCode);
		$url = $this->url($this->instituteCode, 'auth', $this->endpoints->idp->token);

		$req = $this->makePostRequest($url, $form, $headers);
		$body = json_decode($req->body());
		$this->body = $body;

		return $this->body;
	}

	// Hell yeah

	public static function verifyCredentials(string $username, string $password)
	{
		$auth = new self(config('app.institute_code'), $username, $password);
		$res = $auth->login();

		if (isset($res->error) && $res->error == 'invalid_grant') {
			throw new KretaCredentialException('Invalid Kreta credentials!', 401);
		}

		return $res;
	}
}

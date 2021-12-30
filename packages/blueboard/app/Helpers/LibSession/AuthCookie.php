<?php

namespace App\Helpers\LibSession;

use Cookie;

class AuthCookie
{
	private string|null $username = null;
	private string|null $password = null;

	private function getPayload()
	{
		return (object) [
			'timestamp' => time(),
			'username' => $this->username,
			'password' => $this->password,
		];
	}

	private function serializeCookie()
	{
		$json = json_encode($this->getPayload());

		return encrypt($json);
	}

	private function __construct(string $username, string $password)
	{
		$this->username = $username;
		$this->password = $password;
	}

	public static function make(string $username, string $password)
	{
		$cookie = new self($username, $password);

		return cookie('llgapp_auth', $cookie->serializeCookie(), 14400);
	}

	public static function forget()
	{
		return Cookie::forget('llgapp_auth');
	}

	public static function parse(string $cookieString)
	{
		$payload = decrypt($cookieString);

		return json_decode($payload);
	}
}

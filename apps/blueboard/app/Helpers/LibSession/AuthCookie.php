<?php

namespace App\Helpers\LibSession;

use Cookie;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Cookie\CookieJar;

/**
 * Blueboard hitelesítő süti
 * Csak egy (kis) helper class
 *
 * KÉREK. SÜTIT. MOST. :)
 */
class AuthCookie
{
    /**
     * @var string|null
     */
    private string|null $username = null;
    /**
     * @var string|null
     */
    private string|null $password = null;

    /**
     * @param string $username
     * @param string $password
     */
    private function __construct(string $username, string $password)
    {
        $this->username = $username;
        $this->password = $password;
    }

    /**
     * @param string $username
     * @param string $password
     * @return Application|CookieJar|Cookie
     */
    public static function make(
        string $username,
        string $password
    ): Application|CookieJar|\Symfony\Component\HttpFoundation\Cookie {
        $cookie = new self($username, $password);

        $ret = cookie('blueboard_refresh', $cookie->serializeCookie(), 14400);
        $ret->rawBody = $cookie->serializeCookie();

        return $ret;
    }

    /**
     * @return string
     */
    private function serializeCookie(): string
    {
        $json = json_encode($this->getPayload());

        return encrypt($json);
    }

    /**
     * @return object
     */
    private function getPayload(): object
    {
        return (object) [
            'timestamp' => time(),
            'username' => $this->username,
            'password' => $this->password,
        ];
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Cookie
     */
    public static function forget(): \Symfony\Component\HttpFoundation\Cookie
    {
        return Cookie::forget('blueboard_refresh');
    }

    /**
     * @param string $cookieString
     * @return mixed
     */
    public static function parse(string $cookieString)
    {
        $payload = decrypt($cookieString);

        return json_decode($payload);
    }
}

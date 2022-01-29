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

        $ret = cookie('blueboard_refresh', $cookie->serializeCookie(), 14400);
        $ret->rawBody = $cookie->serializeCookie();

        return $ret;
    }

    public static function forget()
    {
        return Cookie::forget('blueboard_refresh');
    }

    public static function parse(string $cookieString)
    {
        $payload = decrypt($cookieString);

        return json_decode($payload);
    }
}

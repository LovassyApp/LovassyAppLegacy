<?php

namespace App\Helpers\LibRefresh;

use App\Helpers\LibRefresh\Models\NewRefreshToken;
use App\Helpers\LibRefresh\Models\RefreshMetadata;
use App\Helpers\LibRefresh\Models\RefreshToken;
use App\Helpers\LibSession\Services\SessionManager;
use App\Helpers\SacroSanctum\Errors\InvalidRefreshTokenException;
use App\Models\User;
use Cookie;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Cookie\CookieJar;
use Str;

/**
 * Blueboard hitelesítő süti
 * Csak egy (kis) helper class
 *
 * KÉREK. SÜTIT. MOST. :)
 *
 */
class AuthCookie
{
    /**
     * @var string|null
     */
    private string|null $password = null;

    private NewRefreshToken|null $newRefreshToken = null;

    private User|null $user = null;

    /**
     * @param string $username
     * @param string $password
     */
    private function __construct(string $password)
    {
        $this->user = SessionManager::user();
        $this->password = $password;
        $this->newRefreshToken = $this->user->createRefreshToken(Str::random(6), $this->password);
    }

    /**
     * @param string $password
     * @return Application|CookieJar|Cookie
     */
    public static function make(string $password): Application|CookieJar|\Symfony\Component\HttpFoundation\Cookie
    {
        $cookie = new self($password);

        $ret = cookie('blueboard_refresh', $cookie->payload(), config('sanctum.refresh_token_expiration'));
        $ret->rawBody = $cookie->payload();
        $ret->expires_at = $cookie->expires_at();

        return $ret;
    }

    /**
     * @return string
     */
    public function payload(): string
    {
        return $this->newRefreshToken->plainTextToken;
    }

    public function expires_at(): int
    {
        return $this->newRefreshToken->refreshToken->expires_at;
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Cookie
     */
    public static function forget(): \Symfony\Component\HttpFoundation\Cookie
    {
        return Cookie::forget('blueboard_refresh');
    }

    /**
     * @param string $plainTextToken
     * @return array
     */
    public static function getPassword(string $plainTextToken): array
    {
        $token = RefreshToken::findToken($plainTextToken);
        if (is_null($token)) {
            throw new InvalidRefreshTokenException('Invalid refresh token supplied');
        }
        $salt = $token->metadata->salt;
        $password_encrypted = $token->metadata->password_encrypted;
        $email = $token->refreshable->email;
        $token->tryUsing();

        return [
            'email' => $email,
            'password' => RefreshMetadata::decryptWithToken($plainTextToken, $password_encrypted, $salt),
        ];
    }
}

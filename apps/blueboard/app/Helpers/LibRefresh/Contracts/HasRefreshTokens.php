<?php

namespace App\Helpers\LibRefresh\Contracts;

use App\Helpers\LibCrypto\Services\EncryptionManager;
use App\Helpers\LibRefresh\Models\NewRefreshToken;
use App\Helpers\LibRefresh\Models\RefreshMetadata;
use App\Helpers\LibRefresh\Models\RefreshToken;
use App\Helpers\SacroSanctum\Contracts\HasRefreshTokens as SacroSanctumHasRefreshTokens;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Str;

trait HasRefreshTokens
{
    use SacroSanctumHasRefreshTokens {
        SacroSanctumHasRefreshTokens::createRefreshToken as sacroSanctumCreate;
    }

    /**
     * HasMany relation for the model and its tokens
     *
     * @return MorphMany
     */
    public function refreshTokens(): MorphMany
    {
        return $this->morphMany(RefreshToken::class, 'refreshable');
    }

    public function createRefreshToken(string $name, string $password): NewRefreshToken
    {
        $plainToken = Str::random(40);

        $token = $this->refreshTokens()->create([
            'name' => $name,
            'token' => hash('sha256', $plainToken),
            'expires_at' => time() + config('sanctum.refresh_token_expiration') * 60,
        ]);

        $newToken = new NewRefreshToken($token, $token->getKey() . '|' . $plainToken);

        $salt = EncryptionManager::generateSalt();
        $encrypted = RefreshMetadata::encryptWithToken($newToken->plainTextToken, $password, $salt);
        $newToken->refreshToken->metadata()->create(['password_encrypted' => $encrypted, 'salt' => $salt]);

        return $newToken;
    }
}

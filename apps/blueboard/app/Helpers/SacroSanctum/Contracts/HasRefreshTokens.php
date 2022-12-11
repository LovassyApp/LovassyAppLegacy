<?php

namespace App\Helpers\SacroSanctum\Contracts;

use App\Helpers\SacroSanctum\Models\NewRefreshToken;
use App\Helpers\SacroSanctum\Models\RefreshToken;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Str;

/**
 * Trait for including RefreshTokens on a model
 */
trait HasRefreshTokens
{
    /**
     * HasMany relation for the model and its tokens
     *
     * @return MorphMany
     */
    public function refreshTokens(): MorphMany
    {
        return $this->morphMany(RefreshToken::class, 'refreshable');
    }

    /**
     * Generates a new RefreshToken
     *
     * _Basically the same standard as Laravel Sanctum._
     *
     * @param string $name
     * @return NewRefreshToken
     */
    public function createRefreshToken(string $name): NewRefreshToken
    {
        $plainToken = Str::random(40);

        $token = $this->refreshTokens()->create([
            'name' => $name,
            'token' => hash('sha256', $plainToken),
            'expires_at' => time() + config('sanctum.refresh_token_expiration'),
        ]);

        return new NewRefreshToken($token, $token->getKey() . '|' . $plainToken);
    }
}

<?php

namespace App\Helpers\SacroSanctum\Models;

use App\Helpers\SacroSanctum\Errors\RefreshTokenExpiredException;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * RefreshToken - For regenerating expired tokens
 */
class RefreshToken extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'token', 'expires_at'];

    protected $hidden = ['token'];

    public function refreshable(): BelongsTo
    {
        return $this->morphTo('refreshable');
    }

    /**
     * Finds the token in the database
     *
     * _Laravel Sanctum style_
     *
     * @param string $plainToken
     */
    public static function findToken(string $plainToken): self|null
    {
        if (strpos($plainToken, '|') === false) {
            return self::where('token', hash('sha256', $plainToken))->first();
        }

        [$id, $token] = explode('|', $plainToken, 2);

        if ($instance = self::find($id)) {
            return hash_equals($instance->token, hash('sha256', $token)) ? $instance : null;
        } else {
            return null;
        }
    }

    public function tryUsing(): bool
    {
        if ($this->expires_at < time()) {
            throw new RefreshTokenExpiredException();
        }

        $this->delete();

        return true;
    }
}

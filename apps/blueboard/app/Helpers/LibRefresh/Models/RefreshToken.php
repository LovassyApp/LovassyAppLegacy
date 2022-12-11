<?php

namespace App\Helpers\LibRefresh\Models;

use App\Helpers\LibRefresh\Contracts\HasRefreshMetadata;
use App\Helpers\SacroSanctum\Models\RefreshToken as SacroSanctumRefreshToken;

class RefreshToken extends SacroSanctumRefreshToken
{
    use HasRefreshMetadata;

    public function tryUsing(): bool
    {
        $this->metadata()->delete();
        $ret = parent::tryUsing();
        return $ret;
    }

    public static function findToken(string $plainToken): self|null
    {
        return parent::findToken($plainToken);
    }
}

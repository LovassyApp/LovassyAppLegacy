<?php

namespace App\Helpers\SacroSanctum\Models;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Jsonable;

/**
 * All the attributes from a newly generated token
 *
 * _Refresh token generation return value_
 */
class NewRefreshToken implements Arrayable, Jsonable
{
    public readonly RefreshToken $refreshToken;

    public readonly string $plainTextToken;

    public function __construct(RefreshToken $refreshToken, string $plainTextToken)
    {
        $this->refreshToken = $refreshToken;
        $this->plainTextToken = $plainTextToken;
    }

    public function toJson($options = 0)
    {
        return json_encode($this->toArray(), $options);
    }

    public function toArray()
    {
        return get_object_vars($this);
    }
}

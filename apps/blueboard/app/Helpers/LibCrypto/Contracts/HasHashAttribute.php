<?php

namespace App\Helpers\LibCrypto\Contracts;

use App\Helpers\LibCrypto\Errors\PrefixRequiredException;
use App\Helpers\LibCrypto\Services\HashManager;

trait HasHashAttribute
{
    public function getHashAttribute()
    {
        if (!isset($this->prefix)) {
            throw new PrefixRequiredException();
        }
        return HashManager::use()->hash_salted((string) $this->id, $this->prefix);
    }
}

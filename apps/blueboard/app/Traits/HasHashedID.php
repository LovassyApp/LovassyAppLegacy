<?php

namespace App\Traits;

use App\Helpers\LibCrypto\Services\EncryptionManager;
trait HasHashedID
{
    public function getHashAttribute()
    {
        return EncryptionManager::use()->hash((string) $this->id, $this->prefix);
    }
}

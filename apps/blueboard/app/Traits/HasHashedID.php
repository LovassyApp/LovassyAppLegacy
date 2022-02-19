<?php

namespace App\Traits;
use App\Helpers\LibSession\SessionManager;

trait HasHashedID
{
    public function getHashAttribute()
    {
        return SessionManager::makeHashedID($this->id);
    }
}

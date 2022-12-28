<?php

namespace App\Permissions\Store;

use App\Helpers\Warden\Interfaces\Permission;

class BuyProduct extends Permission
{
    public function __construct()
    {
        $this->name = 'Vásárlás';
        $this->description = 'Termékek vásárlása a bazárban';
        $this->defaultErrorMessage = $this->default_message();
    }
}

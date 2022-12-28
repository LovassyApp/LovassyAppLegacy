<?php

namespace App\Permissions\Permissions;

use App\Helpers\Warden\Interfaces\Permission;

class ShowGroup extends Permission
{
    public function __construct()
    {
        $this->name = 'Csoport lekérése';
        $this->description = 'Egy adott csoport adatainak lekérése (Boardlight beépített szerkesztőjéhez kell!)';
        $this->defaultErrorMessage = $this->default_message();
    }
}

<?php

namespace App\Permissions\Permissions;

use App\Helpers\Warden\Interfaces\Permission;

class UpdateGroup extends Permission
{
    public function __construct()
    {
        $this->name = 'Szerkesztés';
        $this->description = 'Egy adott csoport adatainak szerkesztése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

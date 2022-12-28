<?php

namespace App\Permissions\Permissions;

use App\Helpers\Warden\Interfaces\Permission;

class CreateGroup extends Permission
{
    public function __construct()
    {
        $this->name = 'Létrehozás';
        $this->description = 'Új csoport létrehozása';
        $this->defaultErrorMessage = $this->default_message();
    }
}

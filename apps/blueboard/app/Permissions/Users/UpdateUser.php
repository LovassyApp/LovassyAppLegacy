<?php

namespace App\Permissions\Users;

use App\Helpers\Warden\Interfaces\Permission;

class UpdateUser extends Permission
{
    public function __construct()
    {
        $this->name = 'Szerkesztés';
        $this->description = 'Egy adott felhasználó adatainak szerkesztése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

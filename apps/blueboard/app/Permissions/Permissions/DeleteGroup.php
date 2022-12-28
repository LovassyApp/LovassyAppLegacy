<?php

namespace App\Permissions\Permissions;

use App\Helpers\Warden\Interfaces\Permission;

class DeleteGroup extends Permission
{
    public function __construct()
    {
        $this->name = 'Törlés';
        $this->description = 'Egy adott csoport törlése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

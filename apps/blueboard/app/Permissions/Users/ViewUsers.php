<?php

namespace App\Permissions\Users;

use App\Helpers\Warden\Interfaces\Permission;

class ViewUsers extends Permission
{
    public function __construct()
    {
        $this->name = 'Listázás';
        $this->description = 'Felhasználói lista megtekintése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

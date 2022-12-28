<?php

namespace App\Permissions\Users;

use App\Helpers\Warden\Interfaces\Permission;

class DeleteUser extends Permission
{
    public function __construct()
    {
        $this->name = 'Törlés';
        $this->description = 'Egy adott felhasználó törlése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

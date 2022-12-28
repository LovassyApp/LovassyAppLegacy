<?php

namespace App\Permissions\Permissions;

use App\Helpers\Warden\Interfaces\Permission;

class ViewGroups extends Permission
{
    public function __construct()
    {
        $this->name = 'Listázás';
        $this->description = 'Csoportlista megtekintése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

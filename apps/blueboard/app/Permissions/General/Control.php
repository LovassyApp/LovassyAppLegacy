<?php

namespace App\Permissions\General;

use App\Helpers\Warden\Interfaces\Permission;

class Control extends Permission
{
    public function __construct()
    {
        $this->name = 'Control';
        $this->description = 'Én ezt nem venném el. Megbénítja az adott csoport minden felhasználóját.';
        $this->defaultErrorMessage = $this->default_message();
    }
}

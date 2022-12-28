<?php

namespace App\Permissions\Inventory;

use App\Helpers\Warden\Interfaces\Permission;

class UseItem extends Permission
{
    public function __construct()
    {
        $this->name = 'Felhasználás';
        $this->description = 'Birtokolt tárgyak felhasználása';
        $this->defaultErrorMessage = $this->default_message();
    }
}

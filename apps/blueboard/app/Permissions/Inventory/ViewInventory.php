<?php

namespace App\Permissions\Inventory;

use App\Helpers\Warden\Interfaces\Permission;

class ViewInventory extends Permission
{
    public function __construct()
    {
        $this->name = 'Listázás';
        $this->description = 'Kincstár megtekintése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

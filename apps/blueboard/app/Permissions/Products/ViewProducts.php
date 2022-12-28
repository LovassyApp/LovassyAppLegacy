<?php

namespace App\Permissions\Products;

use App\Helpers\Warden\Interfaces\Permission;

class ViewProducts extends Permission
{
    public function __construct()
    {
        $this->name = 'Listázás';
        $this->description = 'Terméklista megtekintése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

<?php

namespace App\Permissions\Products;

use App\Helpers\Warden\Interfaces\Permission;

class CreateProduct extends Permission
{
    public function __construct()
    {
        $this->name = 'Létrehozás';
        $this->description = 'Új termék létrehozása';
        $this->defaultErrorMessage = $this->default_message();
    }
}

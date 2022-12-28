<?php

namespace App\Permissions\Products;

use App\Helpers\Warden\Interfaces\Permission;

class ShowProduct extends Permission
{
    public function __construct()
    {
        $this->name = 'Termék lekérése';
        $this->description = 'Egy adott termék adatainak lekérése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

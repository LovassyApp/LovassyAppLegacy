<?php

namespace App\Permissions\Products;

use App\Helpers\Warden\Interfaces\Permission;

class UpdateProduct extends Permission
{
    public function __construct()
    {
        $this->name = 'Szerkesztés';
        $this->description = 'Egy adott termék szerkesztése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

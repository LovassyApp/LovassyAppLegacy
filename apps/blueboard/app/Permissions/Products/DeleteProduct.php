<?php

namespace App\Permissions\Products;

use App\Helpers\Warden\Interfaces\Permission;

class DeleteProduct extends Permission
{
    public function __construct()
    {
        $this->name = 'Törlés';
        $this->description = 'Egy adott termék törlése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

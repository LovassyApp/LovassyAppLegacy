<?php

namespace App\Permissions\Store;

use App\Helpers\Warden\Interfaces\Permission;

class ViewStore extends Permission
{
    public function __construct()
    {
        $this->name = 'Listázás';
        $this->description = 'Bazár termékeinek listázása';
        $this->defaultErrorMessage = $this->default_message();
    }
}

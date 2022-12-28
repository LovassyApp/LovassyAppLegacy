<?php

namespace App\Permissions\Permissions;

use App\Helpers\Warden\Interfaces\Permission;

class ViewPermissions extends Permission
{
    public function __construct()
    {
        $this->name = 'Jogosultságok lekérése';
        $this->description =
            'A rendszerben lévő összes jogosultság lekérése (Boardlight beépített szerkesztőjéhez kell!)';
        $this->defaultErrorMessage = $this->default_message();
    }
}

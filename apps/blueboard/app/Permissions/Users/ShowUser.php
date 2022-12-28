<?php

namespace App\Permissions\Users;

use App\Helpers\Warden\Interfaces\Permission;

class ShowUser extends Permission
{
    public function __construct()
    {
        $this->name = 'Felhasználó lekérése';
        $this->description = 'Egy adott felhasználó adatainak lekérése (Boardlight beépített szerkesztőjéhez kell!)';
        $this->defaultErrorMessage = $this->default_message();
    }
}

<?php

namespace App\Permissions\QRCode;

use App\Helpers\Warden\Interfaces\Permission;

class CreateQRCode extends Permission
{
    public function __construct()
    {
        $this->name = 'Létrehozás';
        $this->description = 'Aktiváló QR kód létrehozása';
        $this->defaultErrorMessage = $this->default_message();
    }
}

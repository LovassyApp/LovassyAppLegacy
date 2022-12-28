<?php

namespace App\Permissions\QRCode;

use App\Helpers\Warden\Interfaces\Permission;

class ValidateQRCode extends Permission
{
    public function __construct()
    {
        $this->name = 'Ellenőrzés';
        $this->description = 'Aktiváló QR kód hitelességének ellenőrzése beváltáskor';
        $this->defaultErrorMessage = $this->default_message();
    }
}

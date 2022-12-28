<?php

namespace App\Permissions\QRCode;

use App\Helpers\Warden\Interfaces\Permission;

class ViewQRCodes extends Permission
{
    public function __construct()
    {
        $this->name = 'Listázás';
        $this->description = 'Aktiváló QR kód lista megtekintése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

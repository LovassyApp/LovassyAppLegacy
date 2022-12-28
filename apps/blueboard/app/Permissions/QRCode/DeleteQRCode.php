<?php

namespace App\Permissions\QRCode;

use App\Helpers\Warden\Interfaces\Permission;

class DeleteQRCode extends Permission
{
    public function __construct()
    {
        $this->name = 'Törlés';
        $this->description = 'Aktiváló QR kód törlése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

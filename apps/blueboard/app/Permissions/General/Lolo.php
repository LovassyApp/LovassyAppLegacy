<?php

namespace App\Permissions\General;

use App\Helpers\Warden\Interfaces\Permission;

class Lolo extends Permission
{
    public function __construct()
    {
        $this->name = 'LoLó';
        $this->description = 'LoLó oldal megtekintése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

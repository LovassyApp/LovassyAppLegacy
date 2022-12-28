<?php

namespace App\Permissions\General;

use App\Helpers\Warden\Interfaces\Permission;

class Grades extends Permission
{
    public function __construct()
    {
        $this->name = 'Jegyek';
        $this->description = 'Jegyek oldal megtekintése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

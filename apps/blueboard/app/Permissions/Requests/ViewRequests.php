<?php

namespace App\Permissions\Requests;

use App\Helpers\Warden\Interfaces\Permission;

class ViewRequests extends Permission
{
    public function __construct()
    {
        $this->name = 'Listázás';
        $this->description = 'Kérvénylista megtekintése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

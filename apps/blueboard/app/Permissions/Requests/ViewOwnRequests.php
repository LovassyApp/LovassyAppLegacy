<?php

namespace App\Permissions\Requests;

use App\Helpers\Warden\Interfaces\Permission;

class ViewOwnRequests extends Permission
{
    public function __construct()
    {
        $this->name = 'Listázás (saját)';
        $this->description = 'Saját kérvények listájának megtekintése';
        $this->defaultErrorMessage = $this->default_message();
    }
}

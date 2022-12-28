<?php

namespace App\Permissions\Requests;

use App\Helpers\Warden\Interfaces\Permission;

class CreateRequest extends Permission
{
    public function __construct()
    {
        $this->name = 'Benyújtás';
        $this->description = 'Új kérvény benyújtása';
        $this->defaultErrorMessage = $this->default_message();
    }
}

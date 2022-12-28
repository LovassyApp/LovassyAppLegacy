<?php

namespace App\Permissions\Requests;

use App\Helpers\Warden\Interfaces\Permission;

class OverruleRequest extends Permission
{
    public function __construct()
    {
        $this->name = 'Elbírálás';
        $this->description = 'Egy adott kérvény elutasítása vagy elfogadása';
        $this->defaultErrorMessage = $this->default_message();
    }
}

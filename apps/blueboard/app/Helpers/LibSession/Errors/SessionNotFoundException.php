<?php

namespace App\Helpers\LibSession\Errors;

use App\Exceptions\APIException;

class SessionNotFoundException extends APIException
{
    protected string $defaultMessage = "The specified token's session could not be found.";
}

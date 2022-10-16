<?php

namespace App\Helpers\LibSession\Errors;

use App\Exceptions\APIException;

class TokenMissingException extends APIException
{
    protected string $defaultMessage = 'The specified session token could not be found.';
}

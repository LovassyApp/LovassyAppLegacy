<?php

namespace App\Helpers\LibCrypto\Errors;

use App\Exceptions\APIException;

class InvalidSaltValueException extends APIException
{
    protected string $defaultMessage = 'The hasher salt associated with this user is invalid.';
}

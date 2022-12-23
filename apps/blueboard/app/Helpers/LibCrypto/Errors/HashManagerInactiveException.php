<?php

namespace App\Helpers\LibCrypto\Errors;

use App\Exceptions\APIException;

class HashManagerInactiveException extends APIException
{
    protected string $defaultMessage = 'This HashManager instance is inactive';
}

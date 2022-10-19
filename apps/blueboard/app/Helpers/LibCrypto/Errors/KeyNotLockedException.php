<?php

namespace App\Helpers\LibCrypto\Errors;

use App\Exceptions\APIException;

class KeyNotLockedException extends APIException
{
    protected string $defaultMessage = 'The key is not encrypted.';
}

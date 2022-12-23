<?php

namespace App\Helpers\LibCrypto\Errors;

use App\Exceptions\APIException;

class PrefixRequiredException extends APIException
{
    protected string $defaultMessage = 'A prefix property is required in order to use ID hashing.';
}

<?php

namespace App\Helpers\LibCrypto\Errors;

use App\Exceptions\APIException;

class MasterKeyLockedException extends APIException
{
    protected string $defaultMessage = 'The master key is still locked.';
}

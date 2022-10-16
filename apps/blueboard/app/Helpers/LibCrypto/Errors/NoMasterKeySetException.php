<?php

namespace App\Helpers\LibCrypto\Errors;

use App\Exceptions\APIException;

class NoMasterKeySetException extends APIException
{
    protected string $defaultMessage = 'The master key could not be loaded from the session.';
}

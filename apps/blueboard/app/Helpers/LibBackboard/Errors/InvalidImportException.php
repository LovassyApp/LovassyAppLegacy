<?php

namespace App\Helpers\LibBackboard\Errors;

use App\Exceptions\APIException;

class InvalidImportException extends APIException
{
    protected string $defaultMessage = 'The imported data provided is invalid.';
}

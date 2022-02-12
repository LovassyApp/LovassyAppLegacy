<?php

namespace App\Exceptions;

class InvalidCodeException extends APIException
{
    protected int $defaultCode = 422;
    protected string $defaultMessage = 'The code supplied is invalid.';
}

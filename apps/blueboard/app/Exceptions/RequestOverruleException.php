<?php

namespace App\Exceptions;

class RequestOverruleException extends APIException
{
    protected int $defaultCode = 422;
    protected string $defaultMessage = 'This request has already been overruled.';
}

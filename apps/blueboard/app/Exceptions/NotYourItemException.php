<?php

namespace App\Exceptions;

class NotYourItemException extends APIException
{
    protected int $defaultCode = 422;
    protected string $defaultMessage = 'The selected item does not belong to your user.';
}

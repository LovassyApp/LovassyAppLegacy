<?php

namespace App\Exceptions;

class ItemAlreadyUsedException extends APIException
{
    protected int $defaultCode = 422;
    protected string $defaultMessage = 'The selected item has already been used.';
}

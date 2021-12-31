<?php

namespace App\Exceptions;

class InsufficientFundsException extends APIException
{
	protected int $defaultCode = 422;
	protected string $defaultMessage = 'You have insufficient funds for this item.';
}

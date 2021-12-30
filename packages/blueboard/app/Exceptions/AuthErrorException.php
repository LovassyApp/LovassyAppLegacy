<?php

namespace App\Exceptions;

class AuthErrorException extends APIException
{
	protected int $defaultCode = 401;
	protected string $defaultMessage = 'Unauthorized.';
}

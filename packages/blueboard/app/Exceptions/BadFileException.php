<?php

namespace App\Exceptions;

class BadFileException extends APIException
{
	protected int $defaultCode = 422;
	protected string $defaultMessage = 'Invalid file submitted.';
}

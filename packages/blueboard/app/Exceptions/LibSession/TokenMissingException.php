<?php

namespace App\Exceptions\LibSession;

use App\Exceptions\APIException;

class TokenMissingException extends APIException
{
	protected string $defaultMessage = 'The specified session token could not be found.';
}

<?php

namespace App\Exceptions\LibSession;

use App\Exceptions\APIException;

class SessionAlreadyStartedException extends APIException
{
	protected string $defaultMessage = 'A session has already been started for this token.';
}

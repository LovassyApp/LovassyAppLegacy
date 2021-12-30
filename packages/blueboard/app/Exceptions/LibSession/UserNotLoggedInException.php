<?php

namespace App\Exceptions\LibSession;

use App\Exceptions\APIException;

class UserNotLoggedInException extends APIException
{
	protected string $defaultMessage = 'No logged in user found.';
	protected int $defaultCode = 401;
}

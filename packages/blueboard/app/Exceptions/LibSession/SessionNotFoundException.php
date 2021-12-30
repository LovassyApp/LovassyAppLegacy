<?php

namespace App\Exceptions\LibSession;

use App\Exceptions\APIException;
use Exception;

class SessionNotFoundException extends APIException
{
	protected string $defaultMessage = "The specified token's session could not be found.";
}

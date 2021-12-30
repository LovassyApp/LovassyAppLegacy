<?php

namespace App\Exceptions;

class UserGroupException extends APIException
{
	protected int $defaultCode = 422;
	protected string $defaultMessage = 'Invalid list of groups supplied for user.';
}

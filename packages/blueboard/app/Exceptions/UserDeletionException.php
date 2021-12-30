<?php

namespace App\Exceptions;

class UserDeletionException extends APIException
{
	protected int $defaultCode = 422;
	protected string $defaultMessage = "You can't delete your own user.";
}

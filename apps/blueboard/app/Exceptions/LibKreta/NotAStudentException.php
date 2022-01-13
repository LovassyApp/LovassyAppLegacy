<?php

namespace App\Exceptions\LibKreta;

use App\Exceptions\APIException;

class NotAStudentException extends APIException
{
	protected string $defaultMessage = "The KRETA account provided doesn't belong to a student.";
	protected int $defaultCode = 403;
}

<?php

namespace App\Exceptions\LibKreta;

use App\Exceptions\APIException;

class KretaCredentialException extends APIException
{
	protected int $defaultCode = 403;
	protected string $defaultMessage = 'No KRETA credentials set.';
}

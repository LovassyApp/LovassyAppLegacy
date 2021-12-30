<?php

namespace App\Exceptions\LibLolo;

use App\Exceptions\APIException;

class GenerationInProgressException extends APIException
{
	protected string $defaultMessage = 'Lolo generation is currently in progress. Please check back later.';
	protected int $defaultCode = 403;
}

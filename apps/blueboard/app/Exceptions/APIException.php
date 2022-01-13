<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\Request;
use Throwable;

class APIException extends Exception
{
	public function __construct(
		string $message = 'Undefined API exception.',
		int $code = 500,
		?Throwable $previous = null
	) {
		// Fakje ternary operátor óverjúszidzs
		// Sok szerencsét a kisilabizálásához. Bazdmeg. ÁÁÁÁ.

		$message = $message != 'Undefined API exception.' ? $message : $this->defaultMessage ?? $message;
		$code = $code != 500 ? $code : $this->defaultCode ?? $code;

		return parent::__construct($message, $code, $previous);
	}

	// Végül is rest api, nem?
	public function render(Request $request)
	{
		throw new ExceptionRenderer($this);
	}
}

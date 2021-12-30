<?php

namespace App\Exceptions\LibKreta;

use Exception, Throwable;
use Illuminate\Http\Request;

class KretaGeneralException extends Exception
{
	public string|null $additionalInfo = null;

	public function __construct(
		string $info,
		string $message = 'Kreta request failed multiple times.',
		int $code = 500,
		?Throwable $previous = null
	) {
		parent::__construct($message, $code, $previous);

		$this->additionalInfo = $info;
	}

	// Végül is rest api, nem?
	public function render(Request $request)
	{
		$type = class_basename($this);
		return response()->json(
			[
				'status' => 'error',
				'message' => $this->getMessage(),
				'type' => $type,
				'additionalInfo' => $this->additionalInfo,
			],
			$this->getCode()
		);
	}
}

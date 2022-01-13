<?php

namespace App\Exceptions\LibKreta;

use Exception, Throwable;
use Illuminate\Http\Request;

class KretaTokenException extends Exception
{
	public string|null $apiResponse = null;

	public function __construct(
		string $response,
		string $message = 'Unexpected Kreta API response',
		int $code = 500,
		?Throwable $previous = null
	) {
		parent::__construct($message, $code, $previous);

		$this->apiResponse = $response;
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
				'rawResponse' => $this->apiResponse,
			],
			$this->getCode()
		);
	}
}

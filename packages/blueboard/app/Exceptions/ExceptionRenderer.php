<?php

namespace App\Exceptions;

use Exception, Throwable;
use Illuminate\Http\Request;

class ExceptionRenderer extends Exception
{
	private string|null $originalClass = null;
	// jaj
	public function __construct(Throwable $ex)
	{
		$this->trace = $ex->getTrace();
		$this->line = $ex->getLine();
		$this->message = $ex->getMessage();
		$this->code = $ex->getCode() == 0 ? 500 : $ex->getCode();
		$this->file = $ex->getFile();

		$this->originalClass = class_basename($ex);
	}

	// Végül is rest api, nem?
	public function render(Request $request)
	{
		return response()->json(
			[
				'status' => 'error',
				'message' => $this->getMessage(),
				'type' => $this->originalClass,
			],
			$this->getCode()
		);
	}
}

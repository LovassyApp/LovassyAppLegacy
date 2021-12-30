<?php

namespace App\Helpers;

class ResponseMaker
{
	private static function generateFrame(array|object $data, string $message): array
	{
		return [
			'status' => 'Success',
			'message' => $message,
			'data' => $data,
		];
	}

	public static function generate(array|object $data, int $code = 200, string $message = '')
	{
		return response()->json(self::generateFrame($data, $message), $code);
	}
}

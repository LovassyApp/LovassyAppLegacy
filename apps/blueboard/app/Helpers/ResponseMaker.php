<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;
use JetBrains\PhpStorm\ArrayShape;

class ResponseMaker
{
    public static function generate(array|object $data, int $code = 200, string $message = ''): JsonResponse
    {
        return response()->json(self::generateFrame($data, $message), $code);
    }

    #[ArrayShape(['status' => 'string', 'message' => 'string', 'data' => 'array|object'])]
    private static function generateFrame(array|object $data, string $message): array {
        return [
            'status' => 'Success',
            'message' => $message,
            'data' => $data,
        ];
    }
}

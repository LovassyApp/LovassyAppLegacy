<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;
use JetBrains\PhpStorm\ArrayShape;
/**
 * Egy kicsike helper *gyönyörű* (a faszt) JSON response-ok generálásához
 */
class ResponseMaker
{
    /**
     * JSON Response-t generál
     *
     * @param array|object $data
     * @param integer $code
     * @param string $message
     * @return JsonResponse
     */
    public static function generate(array|object $data, int $code = 200, string $message = ''): JsonResponse
    {
        return response()->json(self::generateFrame($data, $message), $code);
    }

    /**
     * Frame izé
     *
     * @param array|object $data
     * @param string $message
     * @return array
     */
    #[ArrayShape(['status' => 'string', 'message' => 'string', 'data' => 'array|object'])]
    private static function generateFrame(array|object $data, string $message): array {
        return [
            'status' => 'Success',
            'message' => $message,
            'data' => $data,
        ];
    }
}

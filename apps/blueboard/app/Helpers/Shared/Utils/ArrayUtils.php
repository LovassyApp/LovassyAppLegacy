<?php

namespace App\Helpers\Shared\Utils;

class ArrayUtils
{
    public static function deleteIfExists(array $array, mixed $value): array
    {
        return (array) in_array($value, $array) ? array_values(array_diff($array, [$value])) : $array;
    }

    public static function mergeUnique(array $array, array ...$arrays): array
    {
        return array_unique([...$array, ...$arrays], SORT_REGULAR);
    }

    public static function pushUnique(array $array, mixed $value): array
    {
        return array_unique([...$array, $value]);
    }
}

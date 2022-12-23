<?php

namespace App\Helpers\Shared\Utils;

/**
 * StackOverflow-ról lopva.
 * Köszönjük Emese! (ne. xd)
 */
class StrClean
{
    /**
     * Ékezeteket, egyéb gonoszságokat eltűntetjük
     * @param string $input
     * @return string
     */
    public static function clean(string $input): string
    {
        $utf8 = [
            '/[áàâãªä]/u' => 'a',
            '/[ÁÀÂÃÄ]/u' => 'A',
            '/[ÍÌÎÏ]/u' => 'I',
            '/[íìîï]/u' => 'i',
            '/[éèêë]/u' => 'e',
            '/[ÉÈÊË]/u' => 'E',
            '/[óòôõºö]/u' => 'o',
            '/[ÓÒÔÕÖ]/u' => 'O',
            '/[úùûü]/u' => 'u',
            '/[ÚÙÛÜ]/u' => 'U',
            '/ç/' => 'c',
            '/Ç/' => 'C',
            '/ñ/' => 'n',
            '/Ñ/' => 'N',
            '/–/' => '-', // UTF-8 hyphen to "normal" hyphen
            '/[’‘‹›‚]/u' => ' ', // Literally a single quote
            '/[“”«»„]/u' => ' ', // Double quote
            '/ /' => ' ', // nonbreaking space (equiv. to 0x160)
        ];
        return preg_replace(array_keys($utf8), array_values($utf8), $input);
    }
}

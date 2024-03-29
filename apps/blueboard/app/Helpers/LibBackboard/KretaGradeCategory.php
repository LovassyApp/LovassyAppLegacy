<?php

namespace App\Helpers\LibBackboard;

/**
 * Bullshit kréta jegy kategóriák
 *
 * Full disclosure: A lookupTable a Filces típusokból van
 */
class KretaGradeCategory
{
    public const interim = 1;
    public const firstQuarter = 2;
    public const secondQuarter = 3;
    public const thirdQuarter = 4;
    public const fourthQuarter = 5;
    public const midTerm = 6;
    public const endTerm = 7;
    public const levelExam = 8;
    public const unknown = 0;

    private const lookupTable = [
        'evkozi_jegy_ertekeles' => self::interim,
        'I_ne_jegy_ertekeles' => self::firstQuarter,
        'II_ne_jegy_ertekeles' => self::secondQuarter,
        'III_ne_jegy_ertekeles' => self::thirdQuarter,
        'IV_ne_jegy_ertekeles' => self::fourthQuarter,
        'felevi_jegy_ertekeles' => self::midTerm,
        'evvegi_jegy_ertekeles' => self::endTerm,
        'osztalyozo_vizsga' => self::levelExam,
    ];

    /**
     * Kategóriát KRÉTÁS szöveges szar alapján (mert így wat)
     *
     * @param string $cat
     * @return int
     * @deprecated 3.0.0 (BB V2-ben volt utoljára haszna, amikor még volt mit parseolni)
     */
    public static function parseCategory(string $cat): int
    {
        try {
            $value = self::lookupTable[$cat];
        } catch (\Exception $e) {
            return self::unknown;
        }

        if ($value) {
            return $value;
        } else {
            return self::unknown;
        }
    }
}

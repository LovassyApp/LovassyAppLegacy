<?php

namespace App\Helpers\LibBackboard;

use App\Helpers\StrClean;
use Carbon\Carbon;
use stdClass;

/**
 * Hát... Inkább nem kommentálnám.
 *
 * Kibaszott gusztustalan.
 * * Én meg nemtom miért írtam ezt.
 *
 */
class KretaGrade
{
    /**
     * Jegy UID-ja, Minden jegynek eltér
     *
     * @var string
     */
    public readonly string $uid;
    /**
     * Tantárgy
     *
     * @var string
     */
    public readonly string $subject;
    /**
     * Tantárgy kategória --> Melyik általános tárgynak felel meg a Kréta adatbázisában
     *
     * @var string
     */
    public readonly string $subject_category;
    /**
     * Tanár neve
     *
     * @var string
     */
    public readonly string $teacher;
    /**
     * Jegy (számként)
     *
     * @var integer
     */
    public readonly int $grade;
    /**
     * Szöveges értékelés
     *
     * @var string
     */
    public readonly string $textGrade;
    /**
     * Szöveges értékelés, röviden
     *
     * @var string
     */
    public readonly string $shortTextGrade;
    /**
     * Jegy súlya
     *
     * @var integer
     */
    public readonly int $weight;
    /**
     * Jegy rögzítésének dátuma - Alias mikor tudja adiák megnézni
     *
     * @var string
     */
    public readonly string $date;
    /**
     * Jegy létrehozásának dátuma
     *
     * @var string
     */
    public readonly string $create_date;
    /**
     * Jegy neve
     *
     * @var string
     */
    public readonly string $name;
    /**
     * Értékelés típusa (dolgozat, felelés, tézé, stb.)
     *
     * @var string
     */
    public readonly string $type;
    /**
     * Jegytípus (Magatartás, Szorgalom, Osztályzat)
     *
     * @var string
     */
    public readonly string $gradeType;
    /**
     * Értékelés típusa, de amúgy bullshit, mert inkább azt határozza meg, hogy mikori jegy (Féléves, Évközi, stb.)
     *
     * @var integer
     */
    public readonly int $evaluationType;
    /**
     * Értéklés típusa emberi nyelven
     *
     * @var string
     */
    public readonly string $evaluationTypeDescription;
    /**
     * A csoport akiknek ezt a jegyet adták
     *
     * @var string
     */
    public readonly string $group;

    /**
     * @var array|int[]
     * Lookup table for parsing text grade values
     */
    private array $textGradeLookup = [
        'peldas' => 5,
        'jo' => 4,
        'valtozo' => 3,
        'rossz' => 2,
        'hanyag' => 2,
    ];

    /*
        Megint csak gusztustalan hárdkódolt izé
    */
    private function getType(object $gradeJson): string
    {
        if ($gradeJson->behaviourGrade !== ' - ') {
            return 'MagatartasErtek';
        }
        if ($gradeJson->diligenceGrade !== ' - ') {
            return 'SzorgalomErtek';
        } else {
            return 'Osztalyzat';
        }
    }

    /*
        Gusztustalan hárdkódolt izé
    */
    private function getWeight(string $type): int
    {
        if ($type === 'Írásbeli témazáró dolgozat (dupla súllyal)') {
            return 200;
        } else {
            return 100;
        }
    }

    /**
     * Kréta-féle semmilyen szabványt nem követő, elbaszott dátumok kijavítása
     *
     * @param string $fuckedUpDate
     * @return array
     */
    private function fixDate(string $fuckedUpDate): array
    {
        $elements = explode('.', $fuckedUpDate);
        $elements = array_filter($elements);
        return $elements;
    }

    /**
     * Egy feldolgozatlan jegyből megmondja a szöveges értékelést
     *
     * @param object $gradeJson
     * @return string
     */
    private function getTextGrade(object $gradeJson): string
    {
        if ($gradeJson->behaviourGrade !== ' - ') {
            return $gradeJson->behaviourGrade;
        }
        if ($gradeJson->diligenceGrade !== ' - ') {
            return $gradeJson->diligenceGrade;
        }
        return $gradeJson->textGrade;
    }

    /**
     * Parsing begins...
     * Hát igen. Ez is kicsit fájdalmas.
     *
     * @param stdClass $gradeJson
     * @param array $additionalAttributes
     */
    public function __construct(stdClass $gradeJson, array $additionalAttributes = [])
    {
        $date1 = $this->fixDate($gradeJson->recordDate);
        $date2 = $this->fixDate($gradeJson->createDate);
        $this->date = Carbon::createFromDate($date1[0], $date1[1], $date1[2])->format('Y-m-d');
        $this->create_date = Carbon::createFromDate($date2[0], $date2[1], $date2[2])->format('Y-m-d');

        $this->subject = ucfirst($gradeJson->subject);
        $this->subject_category = ucfirst($gradeJson->subject_category);

        $this->evaluationType = KretaGradeCategory::interim;
        $this->gradeType = $this->getType($gradeJson);
        $this->evaluationTypeDescription = 'Évközi jegy/értékelés';

        $this->teacher = $gradeJson->teacher ?? 'Névtelen hős';
        $this->name = $gradeJson->name === ' - ' ? 'Névtelen jegy' : ucfirst($gradeJson->name);
        $this->type = $gradeJson->type ?? 'Nincs leírás';
        $this->group = $gradeJson->group;

        $this->weight = $this->getWeight($this->type);

        $this->textGrade = $this->convertTextGrade($this->getTextGrade($gradeJson));
        $this->shortTextGrade = $this->convertTextGrade($gradeJson->shortTextGrade);
        $this->grade = (int) $gradeJson->grade ?? (int) $this->convertValueToInteger($this->textGrade);

        $this->uid = hash(
            'sha256',
            $this->date .
                $this->create_date .
                $this->subject .
                $this->subject_category .
                $this->evaluationType .
                $this->evaluationTypeDescription .
                $this->teacher .
                $this->name .
                $this->type .
                $this->weight .
                $this->textGrade .
                $this->shortTextGrade .
                $this->grade
        );

        foreach ($additionalAttributes as $key => $attr) {
            $this->{$key} = $attr;
        }
    }

    /**
     * Jegyet textbe bele abba
     *
     * @param string $grade
     * @return string
     */
    private function convertTextGrade(string $grade): string
    {
        $arr = explode('(', $grade);
        return $arr[array_key_first($arr)];
    }

    /**
     * Jegyet vissza számba bele abba
     *
     * @param string $grade
     * @return int
     */
    private function convertValueToInteger(string $grade): int
    {
        try {
            $textSan = strtolower(StrClean::clean($grade));
            $value = $this->textGradeLookup[$textSan];
        } catch (\Exception $e) {
            return 0;
        }
        if ($value) {
            return $value;
        } else {
            return 0;
        }
    }

    /**
     * Tömbötideeeeee
     *
     * @return array
     *
     */
    public function toArray(): array
    {
        $sanitized = json_encode($this);
        $array = json_decode($sanitized);

        return (array) $array;
    }
}

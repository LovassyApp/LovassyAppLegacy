<?php

namespace App\Helpers\LibKreta\Grades;

/*
    Hát... Inkább nem kommentálnám.

    Kibaszott gusztustalan.
    De ez a kréta emberek.
*/

use App\Helpers\StrClean;
use Carbon\Carbon;
use stdClass;

class KretaGrade
{
    public string $uid;
    public string $bounds;
    public string $subject;
    public string $teacher;
    public int $grade;
    public string $textGrade;
    public string $shortTextGrade;
    public int $weight;
    public string $date;
    public string $name;
    public string $type;
    public string $gradeType;
    public int $evaluationType;
    public string $evaluationTypeDescription;

    // Lookup table for parsing text grade values
    private array $textGradeLookup = [
        'peldas' => 5,
        'jo' => 4,
        'valtozo' => 3,
        'rossz' => 2,
        'hanyag' => 2,
    ];

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

    private function convertTextGrade(string $grade): string
    {
        $arr = explode('(', $grade);
        $first = $arr[array_key_first($arr)];

        return $first;
    }

    // Ouch.
    public function __construct(stdClass $gradeJson, array $additionalAttributes = [])
    {
        $this->uid = $gradeJson->Uid;
        $this->date = Carbon::parse($gradeJson->RogzitesDatuma)->format('Y-m-d H:i:s');
        $this->subject = ucfirst($gradeJson->Tantargy->Leiras ?? $gradeJson->Tantargy->Nev);
        $this->teacher = $gradeJson->ErtekeloTanarNeve ?? 'Névtelen hős';
        $this->name = $gradeJson->Tema ?? 'Névtelen jegy';
        $this->evaluationType = KretaGradeCategory::parseCategory($gradeJson->Tipus->Nev);
        $this->weight = $gradeJson->SulySzazalekErteke ?? 100;
        $this->type = $gradeJson->Mod->Leiras ?? 'Nincs leírás';
        $this->textGrade = $this->convertTextGrade($gradeJson->SzovegesErtek);
        $this->shortTextGrade = $this->convertTextGrade($gradeJson->SzovegesErtekelesRovidNev ?? '');
        $this->grade = $gradeJson->SzamErtek ?? $this->convertValueToInteger($this->textGrade);
        $this->evaluationTypeDescription = $gradeJson->Tipus->Leiras ?? 'Nincs leírás';
        $this->gradeType = $gradeJson->ErtekFajta->Nev ?? 'WAT?';
        $this->bounds = $gradeJson->ErtekFajta->Leiras ?? 'Ajaj.';

        foreach ($additionalAttributes as $key => $attr) {
            $this->{$key} = $attr;
        }
    }

    public function toArray()
    {
        $sanetized = json_encode($this);
        $array = json_decode($sanetized);

        return (array) $array;
    }
}

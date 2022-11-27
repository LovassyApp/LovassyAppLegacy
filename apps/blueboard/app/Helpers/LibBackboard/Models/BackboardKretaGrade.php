<?php

namespace App\Helpers\LibBackboard\Models;

class BackboardKretaGrade
{
    public function __construct(
        public readonly string $subject_category,
        public readonly string $subject,
        public readonly string $group,
        public readonly string $teacher,
        public readonly string $type,
        public readonly string $textGrade,
        public readonly string $grade,
        public readonly string $shortTextGrade,
        public readonly string $behaviourGrade,
        public readonly string $dilligenceGrade,
        public readonly string $createDate,
        public readonly string $recordDate,
        public readonly string $name
    ) {
    }
}

<?php

namespace Database\Seeders;

use App\Helpers\LibBackboard\Models\BackboardKretaGrade;
use App\Helpers\LibBackboard\Models\BackboardKretaGradeCollection;
use App\Models\GradeImport;
use App\Models\User;
use Faker\Generator;
use Illuminate\Container\Container;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class GradeImportSeeder extends Seeder
{
    protected Generator $faker;
    private static int $grade_count = 5;
    private static int $subject_count = 5;

    private static array $numbers = ['9ny', '9', '10', '11', '12'];
    private static array $letters = ['A', 'B', 'C', 'D'];

    private static array $textGrades = [
        5 => 'Jeles(5)',
        4 => 'Jó(4)',
        //3 => 'Közepes(3)',
        //2 => 'Elégséges(2)',
        //1 => 'Elégtelen(1)',
    ];

    private static int $maxGrade = 5;
    private static int $minGrade = 4;

    private static array $types = [
        'Szorgalmi feladat',
        'Írásbeli röpdolgozat',
        'Írásbeli dolgozat',
        'Gyakorlati feladat',
        'Szóbeli feladat',
        'Írásbeli témazáró dolgozat',
        'Írásbeli témazáró dolgozat (dupla súllyal)',
    ];

    private function get_users(): Collection
    {
        return User::where('import_available', false)->get();
    }

    private function generateFakeGradeData(): array
    {
        $subjects = [];
        $grades = [];

        for ($i = 0; $i < self::$subject_count; $i++) {
            $subjects[$i] = [ucfirst($this->faker->words(2, true)), implode('_', $this->faker->words(2))];
            for ($x = 0; $x < self::$grade_count; $x++) {
                $number = self::$numbers[array_rand(self::$numbers)];
                $letter = self::$letters[array_rand(self::$letters)];

                $groupID = $number . '.' . $letter . '_' . $this->faker->word();
                $grade = $this->faker->numberBetween(self::$minGrade, self::$maxGrade);

                $grade = new BackboardKretaGrade(
                    $subjects[$i][1],
                    $subjects[$i][0],
                    $groupID,
                    $this->faker->name(),
                    self::$types[array_rand(self::$types)],
                    self::$textGrades[$grade],
                    (string) $grade,
                    '',
                    '',
                    '',
                    date('Y.m.d.'),
                    date('Y.m.d.'),
                    ucfirst($this->faker->words(3, true))
                );

                array_push($grades, $grade);
            }
        }

        return $grades;
    }

    private function makeGradeCollectionForUser(User $user)
    {
        $number = self::$numbers[array_rand(self::$numbers)];
        $letter = self::$letters[array_rand(self::$letters)];
        $gradeCollection = new BackboardKretaGradeCollection(
            $user,
            $number . '.' . $letter,
            $user->name,
            $this->generateFakeGradeData()
        );

        return $gradeCollection;
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->faker = Container::getInstance()->make(Generator::class);
        $users = $this->get_users();

        foreach ($users as $user) {
            $gradeCollection = $this->makeGradeCollectionForUser($user);
            $messageObject = $gradeCollection->makeMessage(false);
            $import = new GradeImport();
            $import->user_id = $user->id;
            $import->encryption_key = $messageObject->key_encrypted;
            $import->json_encrypted = $messageObject->message_encrypted;
            $import->save();

            $user->import_available = true;
            $user->save();
        }

        info("Done! Generated mock GradeData for {$users->count()} users.");
    }
}

<?php

namespace App\Helpers\LibLolo;

use App\Exceptions\LibLolo\GenerationInProgressException;
use App\Helpers\LibKreta\Grades\KretaGradeCategory;
use App\Models\User;
use App\Models\Lolo;
use App\Models\LoloRequest;
use Illuminate\Cache\Lock;
use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class LoloGenerator
{
    // Ezt amúgy nem tervezem hardcode-olni chill.
    // Csaaaak előtte kéne egy globális config kezelő
    // Majd lösz az is
    private int $fiveLimit = 3;
    private int $fourLimit = 5;
    private string $messageFive = 'Ötösökből automatikusan generálva.';
    private string $messageFour = 'Négyesekből automatikusan generálva.';
    private static string $messageRequest = 'LoLó kérvényből jóváírva.';

    private Lock $lock;
    private string $lockPre = 'lologen-';

    private User|null $user = null;

    private function getLockName(int $id)
    {
        return $this->lockPre . (string) $id;
    }

    public function __construct(User $user)
    {
        $this->user = $user;
        $this->lock = Cache::lock($this->getLockName($user->id));
        try {
            $this->lock->block(5);
        } catch (LockTimeoutException $e) {
            throw new GenerationInProgressException();
        }
    }

    private function save(Collection $grades, string $message)
    {
        $lolo = new Lolo();
        $lolo->fill([
            'user_id' => $this->user->id,
            'isSpent' => false,
            'reason' => [
                'type' => 'grades',
                'message' => $message,
            ],
        ]);

        $lolo->save();

        try {
            foreach ($grades as $grade) {
                $grade->lolo_id = $lolo->id;
                $grade->save();
            }
        } catch (\Exception $e) {
            $lolo->delete();
            throw $e;
        }
    }

    private function fiveGenerate()
    {
        $grades = $this->user
            ->grades()
            ->where('lolo_id', null)
            ->where('evaluationType', KretaGradeCategory::interim)
            ->where('grade', 5)
            ->get()
            ->chunk($this->fiveLimit);

        foreach ($grades as $group) {
            if ($group->count() != $this->fiveLimit) {
                break;
            }
            $this->save($group, $this->messageFive);
        }
    }

    private function fourGenerate()
    {
        $grades = $this->user
            ->grades()
            ->where('lolo_id', null)
            ->where('evaluationType', KretaGradeCategory::interim)
            ->where('grade', 4)
            ->get()
            ->chunk($this->fourLimit);

        foreach ($grades as $group) {
            if ($group->count() != $this->fourLimit) {
                break;
            }
            $this->save($group, $this->messageFour);
        }
    }

    public function generate()
    {
        $this->fiveGenerate();
        $this->fourGenerate();
    }

    public function __destruct()
    {
        $this->lock->release();
    }

    public static function saveRequest(int $amount, LoloRequest $request)
    {
        $attributes = [
            'user_id' => $request->user->id,
            'isSpent' => false,
            'reason' => [
                'type' => 'request',
                'message' => self::$messageRequest,
                'body' => "Kérvény: $request->title",
            ],
        ];

        for ($i = 0; $i < $amount; $i++) {
            $newCoin = new Lolo();
            $newCoin->fill($attributes);
            $newCoin->save();
        }
    }
}

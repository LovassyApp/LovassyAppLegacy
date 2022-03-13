<?php

namespace App\Helpers\LibLolo;

use App\Exceptions\LibLolo\GenerationInProgressException;
use App\Helpers\LibKreta\Grades\KretaGradeCategory;
use App\Models\Lolo;
use App\Models\LoloRequest;
use App\Models\User;
use Exception;
use Illuminate\Contracts\Cache\Lock;
use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

/**
 * LoLó generálásra helper class
 * Semmi. De tényleg semmi
 */
class LoloGenerator
{
    /**
     * @var int
     */
    private int $fiveLimit;
    /**
     * @var int
     */
    private int $fourLimit;
    /**
     * @var string
     */
    private string $messageFive;
    /**
     * @var string
     */
    private string $messageFour;
    /**
     * @var Lock
     */
    private Lock $lock;
    /**
     * @var string
     */
    private string $lockPre;

    /**
     * @var User|null
     */
    private User|null $user = null;

    /**
     * @throws GenerationInProgressException
     * @var User
     */
    public function __construct(User $user)
    {
        $this->loadConfig();
        $this->user = $user;
        $this->lock = Cache::lock($this->getLockName($user->id));
        try {
            $this->lock->block(5);
        } catch (LockTimeoutException $e) {
            throw new GenerationInProgressException();
        }
    }

    /**
     * @return void
     */
    private function loadConfig(): void
    {
        $this->fiveLimit = config('lolo.five_threshold');
        $this->fourLimit = config('lolo.four_threshold');
        $this->messageFive = config('lolo.five_reason');
        $this->messageFour = config('lolo.four_reason');
        $this->lockPre = config('lolo.lock_prefix');
    }

    /**
     * @param int $id
     * @return string
     */
    private function getLockName(int $id): string
    {
        return $this->lockPre . (string) $id;
    }

    /**
     * @param int $amount
     * @param LoloRequest $request
     * @return void
     */
    public static function saveRequest(int $amount, LoloRequest $request)
    {
        $attributes = [
            'user_id' => $request->user->id,
            'isSpent' => false,
            'reason' => [
                'type' => 'request',
                'message' => config('lolo.request_reason'),
                'body' => "Kérvény: $request->title",
            ],
        ];

        for ($i = 0; $i < $amount; $i++) {
            $newCoin = new Lolo();
            $newCoin->fill($attributes);
            $newCoin->save();
        }
    }

    /**
     * @return void
     * @throws Exception
     */
    public function generate()
    {
        $this->fiveGenerate();
        $this->fourGenerate();
    }

    /**
     * @throws Exception
     */
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

    /**
     * @param Collection $grades
     * @param string $message
     * @return void
     * @throws Exception
     */
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
                $grade->lolo_id = $lolo->hash;
                $grade->save();
            }
        } catch (Exception $e) {
            $lolo->delete();
            throw $e;
        }
    }

    /**
     * @return void
     * @throws Exception
     */
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

    /**
     *
     */
    public function __destruct()
    {
        $this->lock->release();
    }
}

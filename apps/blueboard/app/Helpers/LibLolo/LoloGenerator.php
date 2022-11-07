<?php

namespace App\Helpers\LibLolo;

use App\Exceptions\LibLolo\GenerationInProgressException;
use App\Helpers\LibBackboard\KretaGradeCategory as LibBackboardKretaGradeCategory;
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
     * A limit amit elérve ötösökből LoLó-t generál a cucc
     * @var int
     */
    private int $fiveLimit;
    /**
     * A limit amit elérve négyesekből LoLó-t generál a cucc
     * @var int
     */
    private int $fourLimit;
    /**
     * Ötösökből generált LoLó-k miértbaszki-üzenete
     * @var string
     */
    private string $messageFive;
    /**
     * Négyesekből generált LoLó-k demiért üzenete
     * @var string
     */
    private string $messageFour;
    /**
     * Lock, mégpedig a csalások elkerülése végett
     * @var Lock
     */
    private Lock $lock;
    /**
     * Lock prefix izé
     * @var string
     */
    private string $lockPre;

    /**
     * Jelenlegi Júzer (tm)
     * @var User|null
     */
    private User|null $user = null;

    /**
     * Új generátor instance, Exception-t dob, ha lockolva van a generátor
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
     * Config betöltése a lolo.php-ból
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
     * lakatnévgenerátor
     * @param int $id
     * @return string
     */
    private function getLockName(int $id): string
    {
        return $this->lockPre . (string) $id;
    }

    /**
     * LoLó kérvényből származó LoLó-kat generálja, majd menti a DB-be
     * @param int $amount
     * @param LoloRequest $request
     * @return void
     */
    public static function saveRequest(int $amount, LoloRequest $request): void
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
     * Generáljá' mán
     * @return void
     * @throws Exception
     */
    public function generate(): void
    {
        $this->fiveGenerate();
        $this->fourGenerate();
    }

    /**
     * Ötösökből *próbálkozik* LoLó-t generálni
     * @throws Exception
     */
    private function fiveGenerate(): void
    {
        $grades = $this->user
            ->grades()
            ->where('lolo_id', null)
            ->where('evaluationType', LibBackboardKretaGradeCategory::interim)
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
     * LoLó-t csinál megadott jegyekből
     * @param Collection $grades
     * @param string $message
     * @return void
     * @throws Exception
     */
    private function save(Collection $grades, string $message): void
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
     * Négyesekből *próbálkozik* LoLó-t generálni
     * @return void
     * @throws Exception
     */
    private function fourGenerate(): void
    {
        $grades = $this->user
            ->grades()
            ->where('lolo_id', null)
            ->where('evaluationType', LibBackboardKretaGradeCategory::interim)
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
     * Medzsik, csak leadja a lokkot (igen kétkáááá)
     */
    public function __destruct()
    {
        $this->lock->release();
    }
}

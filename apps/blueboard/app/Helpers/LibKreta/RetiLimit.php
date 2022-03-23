<?php

namespace App\Helpers\LibKreta;

use App\Helpers\LibSession\SessionManager;
use App\Models\User;
use Carbon\Carbon;

/**
 * Egy nagyon kis fostos rate limit cucc
 * * Vagyis ahogy mi hívjuk (egy ismerősünk után, aki az ötletet adta): RétiLimit (tm)
 * * * _Ezt baszki tényleg levédetem..._
 */
class RetiLimit
{
    /**
     * @var User|null
     */
    private User|null $user = null;
    /**
     * @var int|\Illuminate\Config\Repository|\Illuminate\Contracts\Foundation\Application|mixed
     */
    private int $hourCount = 0;

    /**
     * Privát konsztráktor? He?
     */
    private function __construct()
    {
        $this->user = SessionManager::user();
        $this->hourCount = config('kreta.rate_limit_hours');
    }

    /**
     * @param callable $callback
     * @return void
     */
    public static function useRateLimit(callable $callback)
    {
        $obj = new self();
        if ($obj->checkExpiry()) {
            $callback();
            $obj->update();
        }
    }

    /**
     * @return bool
     */
    private function checkExpiry()
    {
        $lastTime = $this->user->kreta_update_timestamp;
        $currentTime = Carbon::now();
        $added = $lastTime->addUnit('hour', $this->hourCount);
        return $currentTime->gte($added);
    }

    /**
     * @return void
     */
    private function update()
    {
        $now = Carbon::now();
        $this->user->kreta_update_timestamp = $now;
        $this->user->save();
    }
}

<?php

namespace App\Helpers\LibLolo;

use App\Events\LoloAmountUpdated;
use App\Exceptions\InsufficientFundsException;
use App\Exceptions\LibKreta\KretaCredentialException;
use App\Helpers\LibKreta\Evaluations;
use App\Helpers\LibSession\SessionManager;
use App\Models\Grade;
use App\Models\Lolo;
use App\Models\User;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

/**
 * LoLó-kkal végzett műveletekhez helper class
 */
class LoloHelper
{
    /**
     * @var int
     */
    public int $balance = 0;
    /**
     * @var Collection|null
     */
    public Collection|null $coins = null;
    /**
     * @var User|\Illuminate\Contracts\Auth\Authenticatable|null
     */
    public User|null $user = null;

    /**
     *
     */
    public function __construct()
    {
        $this->user = Auth::user();
        $this->coins = $this->getAllCoins();
        $this->balance = $this->getBalance();
    }

    /**
     * @return Collection
     */
    private function getAllCoins(): Collection
    {
        return $this->user
            ->lolo()
            ->with('grades')
            ->get();
    }

    /**
     * @return int
     */
    private function getBalance(): int
    {
        return $this->user
            ->lolo()
            ->where('isSpent', 0)
            ->count();
    }

    /**
     * @throws KretaCredentialException
     * @throws Exception
     */
    public static function updateGrades()
    {
        $userID = Auth::user()->hash;

        $credentials = SessionManager::getKretaEncrypter()->getCreds();
        $grades = new Evaluations($credentials->token);
        $allGrades = $grades->parse(['user_id' => $userID]);

        Grade::upsert($allGrades, ['uid']);
    }

    /**
     * @return LoloHelper
     */
    public static function getLolo(): LoloHelper
    {
        return new self();
    }

    /**
     * @param int $amount
     * @return void
     * @throws InsufficientFundsException
     */
    public function spend(int $amount)
    {
        $ids = $this->coins
            ->where('isSpent', 0)
            ->take($amount)
            ->pluck('id');
        if ($ids->count() < $amount) {
            throw new InsufficientFundsException();
        }

        Lolo::whereIn('id', $ids)->update(['isSpent' => true]);

        $coins = $this->getAllCoins();
        $this->balance = $coins->where('isSpent', 0)->count();

        LoloAmountUpdated::dispatch($this->user, $this->balance, $coins->toArray());
    }
}

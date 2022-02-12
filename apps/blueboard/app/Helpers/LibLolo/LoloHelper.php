<?php

namespace App\Helpers\LibLolo;

use App\Events\LoloAmountUpdated;
use App\Exceptions\InsufficientFundsException;
use Illuminate\Support\Facades\Auth;
use App\Helpers\LibSession\SessionManager;
use App\Models\Grade;
use App\Helpers\LibKreta\Evaluations;
use App\Models\Lolo;
use App\Models\User;
use Illuminate\Support\Collection;

class LoloHelper
{
    public int $balance = 0;
    public Collection|null $coins = null;
    public User|null $user = null;

    public static function updateGrades()
    {
        $userID = Auth::user()->id;

        $creds = SessionManager::getKretaEncrypter()->getCreds();
        $grades = new Evaluations($creds->token);
        $allGrades = $grades->parse(['user_id' => $userID]);

        Grade::upsert($allGrades, ['uid']);
    }

    public static function getLolo()
    {
        return new self();
    }

    public function __construct()
    {
        $this->user = Auth::user();
        $this->coins = $this->getAllCoins();
        $this->balance = $this->getBalance();
    }

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
        $this->balance = $this->getBalance();
        LoloAmountUpdated::dispatch($this->user, $this->balance);
    }

    private function getAllCoins()
    {
        return $this->user
            ->lolo()
            ->with('grades')
            ->get();
    }

    private function getBalance()
    {
        return $this->user
            ->lolo()
            ->where('isSpent', 0)
            ->count();
    }
}

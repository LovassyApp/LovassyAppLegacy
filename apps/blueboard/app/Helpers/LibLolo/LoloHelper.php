<?php

namespace App\Helpers\LibLolo;

use App\Events\LoloAmountUpdated;
use App\Exceptions\InsufficientFundsException;
use App\Exceptions\LibKreta\KretaCredentialException;
use App\Helpers\LibKreta\KretaEncrypter;
use App\Helpers\LibKreta\Evaluations;
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
     * Drága Júzerünk egyenlege
     * @var int
     */
    public int $balance;
    /**
     * Eme *kolleksön* az "érméket" tartalmazza
     */
    public readonly Collection|null $coins;
    /**
     * User, akire a generálás történt
     */
    public readonly User|null $user;

    /**
     * Új class instance, feltölti az attributumokat
     */
    public function __construct()
    {
        $this->user = Auth::user();
        $this->coins = $this->getAllCoins();
        $this->balance = $this->getBalance();
    }

    /**
     * Lekéri az összes az adott felhasználóhoz tartozó LoLó-t
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
     * Lekéri az adott felhasználó egyenlegét
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
     * WTF... Ez a szerencsétlen class igazából csak magát adja vissza.
     *
     * Szép volt, kedves múltbéli énem.
     *
     * *Nembaj. lórnak jólösz*
     * @return LoloHelper
     */
    public static function getLolo(): LoloHelper
    {
        return new self();
    }

    /**
     * Adott mennyiségű LoLó-t elkölt.
     *
     * Ha nincs elég LoLó-ja az adott usernek, akkor Exception-t dob.
     *
     * *Szórjuk a pénzt mint a rakéta...*
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

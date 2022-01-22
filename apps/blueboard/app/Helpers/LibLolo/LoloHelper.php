<?php

namespace App\Helpers\LibLolo;

use Illuminate\Support\Facades\Auth;
use App\Helpers\LibSession\SessionManager;
use App\Models\Grade;
use App\Helpers\LibKreta\Evaluations;

class LoloHelper
{
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
        $user = Auth::user();
        $lolos = $user
            ->lolo()
            ->with('grades')
            ->get();
        $balance = $user
            ->lolo()
            ->where('isSpent', 0)
            ->count();

        return (object) [
            'balance' => $balance,
            'coins' => $lolos,
        ];
    }
}

<?php

namespace App\Http\Controllers;

use App\Events\LoloAmountUpdated;
use App\Permissions\General\Lolo;
use App\Helpers\LibCrypto\Services\HashManager;
//use App\Helpers\LibKreta\RetiLimit;
use Illuminate\Http\Request;
use App\Helpers\LibLolo\LoloGenerator;
use App\Helpers\LibLolo\LoloHelper;
use App\Helpers\LibSession\Services\SessionManager;
use App\Helpers\Shared\Utils\ResponseMaker;

class LoloGetController extends Controller
{
    public function index()
    {
        $this->warden_authorize(Lolo::use());

        $gen = new LoloGenerator(SessionManager::user());
        $gen->generate();

        $helper = LoloHelper::getLolo();
        LoloAmountUpdated::dispatch($helper->user, $helper->balance, $helper->coins->toArray());

        $res = [
            'balance' => $helper->balance,
            'coins' => $helper->coins,
        ];

        return ResponseMaker::generate($res);
    }
}

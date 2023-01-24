<?php

namespace App\Http\Controllers;

use App\Events\LoloAmountUpdated;
use App\Helpers\LibBackboard\BackboardAdapter;
use App\Helpers\LibCrypto\Services\EncryptionManager;
use App\Permissions\General\Lolo;
use App\Helpers\LibLolo\LoloGenerator;
use App\Helpers\LibLolo\LoloHelper;
use App\Helpers\LibSession\Services\SessionManager;
use App\Helpers\Shared\Utils\ResponseMaker;

class LoloGetController extends Controller
{
    public function index()
    {
        $this->warden_authorize(Lolo::use());

        $user = SessionManager::user();
        $encryption_manager = EncryptionManager::use();

        $adapter = new BackboardAdapter($user, $encryption_manager);
        $adapter->tryUpdating();

        $gen = new LoloGenerator($user);
        $gen->generate();

        $helper = LoloHelper::getLolo();
        LoloAmountUpdated::dispatch($helper->user, $helper->balance, $helper->coins->toArray());

        return ResponseMaker::generate([
            'balance' => $helper->balance,
            'coins' => $helper->coins,
        ]);
    }
}

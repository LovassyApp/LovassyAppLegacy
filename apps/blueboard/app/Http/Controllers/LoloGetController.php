<?php

namespace App\Http\Controllers;

use App\Events\LoloAmountUpdated;
//use App\Helpers\LibKreta\RetiLimit;
use Illuminate\Http\Request;
use App\Helpers\LibLolo\LoloGenerator;
use App\Helpers\LibLolo\LoloHelper;
use App\Helpers\LibSession\Services\SessionManager;
use App\Helpers\ResponseMaker;

class LoloGetController extends Controller
{
    protected string $permissionScope = 'General';

    public function index(Request $request)
    {
        $this->checkPermission('lolo');

        $refresh = (bool) $request->query('refresh', false);
        /* RetiLimit::useRateLimit(function () use ($refresh) {
            if ($refresh == true) {
                LoloHelper::updateGrades();
            }
        }); */

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

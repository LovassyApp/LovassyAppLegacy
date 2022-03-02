<?php

namespace App\Http\Controllers;

use App\Events\LoloAmountUpdated;
use Illuminate\Http\Request;
use App\Helpers\LibLolo\LoloGenerator;
use App\Helpers\LibLolo\LoloHelper;
use App\Helpers\LibSession\SessionManager;
use App\Helpers\ResponseMaker;

class LoloGetController extends Controller
{
    protected string $permissionScope = 'General';

    public function index(Request $request)
    {
        $this->checkPermission('lolo');

        $refresh = (bool) $request->query('refresh', false);
        if ($refresh == true) {
            LoloHelper::updateGrades();
        }
        $gen = new LoloGenerator(SessionManager::user());
        $gen->generate();

        $helper = LoloHelper::getLolo();
        LoloAmountUpdated::dispatch($helper->user, $helper->balance, $helper->coins->toArray());

        return ResponseMaker::generate($helper);
    }
}

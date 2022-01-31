<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\LibSession\SessionManager;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class FrontendControlController extends Controller
{
    protected string $permissionScope = 'General';

    public function index(Request $request)
    {
        $this->checkPermission('control');

        $user = User::where('id', Auth::user()->id)
            ->setEagerLoads([])
            ->first();
        $sessionData = SessionManager::getSession()->all();
        //$crypt = SessionManager::getKretaEncrypter();

        //dd($locale = app()->getLocale());

        return response()->json([
            'user' => $user,
            'session' => $sessionData,
            'permissions' => $this->permissionHelper()->getAllPermissions(),
            //'kretaDecrypted' => $crypt->getCreds(),
        ]);
    }
}

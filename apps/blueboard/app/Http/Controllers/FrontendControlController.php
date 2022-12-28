<?php

namespace App\Http\Controllers;

use App\Permissions\General\Control;
use App\Helpers\Warden\Services\Warden;
use App\Helpers\LibSession\Services\SessionManager;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class FrontendControlController extends Controller
{
    public function index()
    {
        $this->warden_authorize(Control::use());

        $user = User::where('id', Auth::user()->id)
            ->setEagerLoads([])
            ->first();
        $sessionData = SessionManager::session()->all(true, ['master_key', 'salt', 'user_salt']);

        return response()->json([
            'user' => $user,
            'session' => $sessionData,
            'permissions' => Warden::use()->getAllPermissions(),
            'groups' => $user->groups()->get(),
        ]);
    }
}

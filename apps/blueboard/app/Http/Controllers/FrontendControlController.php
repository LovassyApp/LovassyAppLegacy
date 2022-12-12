<?php

namespace App\Http\Controllers;

use App\Helpers\LibSession\Services\SessionManager;
use Illuminate\Http\Request;
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
        $sessionData = SessionManager::session()->all(true, ['master_key', 'salt', 'user_salt']);

        return response()->json([
            'user' => $user,
            'session' => $sessionData,
            'permissions' => $this->permissionHelper()->getAllPermissions(),
            'groups' => $this->permissionHelper()->getUserGroups(),
        ]);
    }
}

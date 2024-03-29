<?php

namespace App\Http\Controllers;

use App\Events\UserGroupsChanged;
use App\Helpers\Shared\Utils\ResponseMaker;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Exceptions\UserDeletionException;
use App\Exceptions\UserGroupException;
use App\Permissions\Users\ShowUser;
use App\Permissions\Users\ViewUsers;
use App\Http\Requests\Users\UserDeleteRequest;
use App\Http\Requests\Users\UserUpdateRequest;
use App\Models\Group;

class UserController extends Controller
{
    public function index()
    {
        $this->warden_authorize(ViewUsers::use());
        $users = User::with(['lolo', 'groups'])->get();

        return ResponseMaker::generate($users);
    }

    public function show(int $userID)
    {
        $this->warden_authorize(ShowUser::use());
        $user = User::with(['lolo', 'groups'])->findOrFail($userID);

        return ResponseMaker::generate($user);
    }

    public function update(UserUpdateRequest $request)
    {
        $data = $request->safe();

        $user = User::findOrFail($data['id']);
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->save();

        $this->warden()->invalidate($user);

        $res = Group::whereIn('id', $data['groups'])->count();
        if ($res !== count($data['groups'])) {
            throw new UserGroupException();
        }

        $user->groups()->sync($data['groups']);
        $groups = $user->groups()->get();
        UserGroupsChanged::dispatch($groups, $user);

        return ResponseMaker::generate([], 200, 'User updated successfully!');
    }

    public function delete(UserDeleteRequest $request)
    {
        $id = $request->safe()['id'];

        if ($id == Auth::user()->id) {
            throw new UserDeletionException();
        }

        $user = User::findOrFail($id);
        $user->delete();
        return ResponseMaker::generate([], 200, 'User deleted successfully!');
    }
}

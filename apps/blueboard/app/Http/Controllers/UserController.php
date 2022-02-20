<?php

namespace App\Http\Controllers;

use App\Exceptions\APIException;
use App\Helpers\ResponseMaker;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Exceptions\UserDeletionException;
use App\Exceptions\UserGroupException;
use App\Models\UserGroup;

class UserController extends Controller
{
    protected string $permissionScope = 'Users';

    public function index()
    {
        $this->checkPermission('view');
        $users = User::with(['lolo', 'groups'])->get();

        return ResponseMaker::generate($users);
    }

    public function show(int $userID)
    {
        $this->checkPermission('show');
        $user = User::with(['lolo', 'groups'])->findOrFail($userID);

        return ResponseMaker::generate($user);
    }

    public function update(Request $request)
    {
        $this->checkPermission('update');
        $id = $request->validate([
            'id' => ['required', 'integer'],
        ])['id'];

        $user = User::findOrFail($id);

        $data = request()->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'regex:/(.*)lovassy\.edu\.hu$/i',
                'unique:users,email,' . $id,
            ],
            'groups' => ['nullable', 'array'],
        ]);

        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->save();

        $res = UserGroup::whereIn('id', $data['groups'])->count();
        if ($res !== count($data['groups'])) {
            throw new UserGroupException();
        }

        $user->groups()->sync($data['groups']);

        return ResponseMaker::generate([], 200, 'User updated successfully!');
    }

    public function delete(Request $request)
    {
        $this->checkPermission('delete');
        $id = $request->validate([
            'id' => ['required', 'integer'],
        ])['id'];

        if ($id == Auth::user()->id) {
            throw new UserDeletionException();
        }

        $user = User::findOrFail($id);
        $user->delete();
        return ResponseMaker::generate([], 200, 'User deleted successfully!');
    }
}

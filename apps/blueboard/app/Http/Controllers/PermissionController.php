<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\PermissionManager\PermissionHelper;
use App\Helpers\ResponseMaker;
use App\Http\Requests\Groups\AddGroupRequest;
use App\Http\Requests\Groups\DeleteGroupRequest;
use App\Http\Requests\Groups\UpdateGroupRequest;
use App\Models\UserGroup;
use Illuminate\Validation\ValidationException;

class PermissionController extends Controller
{
    protected string $permissionScope = 'Permissions';

    public function index()
    {
        $this->checkPermission('view');
        $all = UserGroup::all();
        return ResponseMaker::generate($all);
    }

    public function getPermissions(PermissionHelper $permissionHelper)
    {
        $this->checkPermission('getpermissions');
        $permissions = $permissionHelper->getDisplayPermissionList();
        return ResponseMaker::generate($permissions);
    }

    public function getGroup(int $groupID)
    {
        $this->checkPermission('viewgroup');
        $group = UserGroup::findOrFail($groupID);
        return ResponseMaker::generate($group);
    }

    public function save(AddGroupRequest $request)
    {
        $data = $request->safe();

        $group = new UserGroup();
        $group->name = $data['name'];
        $group->permissions = $data['permissions'];
        $group->save();

        return ResponseMaker::generate([], 200, 'Group generated successfully!');
    }

    public function update(UpdateGroupRequest $request)
    {
        $data = $request->safe();
        $group = UserGroup::findOrFail($data['id']);

        $group->name = $data['name'];
        $group->permissions = $data['permissions'];
        $group->save();

        return ResponseMaker::generate([], 200, 'Group updated successfully!');
    }

    public function delete(DeleteGroupRequest $request)
    {
        $id = $request->safe()['id'];

        $group = UserGroup::findOrFail($id);
        $group->delete();
        return ResponseMaker::generate([], 200, 'Group deleted successfully!');
    }
}

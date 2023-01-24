<?php

namespace App\Http\Controllers;

use App\Permissions\Permissions\ShowGroup;
use App\Permissions\Permissions\ViewGroups;
use App\Permissions\Permissions\ViewPermissions;
use App\Helpers\Shared\Utils\ResponseMaker;
use App\Http\Requests\Groups\AddGroupRequest;
use App\Http\Requests\Groups\DeleteGroupRequest;
use App\Http\Requests\Groups\UpdateGroupRequest;
use App\Models\Group;

class PermissionController extends Controller
{
    public function index()
    {
        $this->warden_authorize(ViewGroups::use());
        $all = Group::all();
        return ResponseMaker::generate($all);
    }

    public function getPermissions()
    {
        $this->warden_authorize(ViewPermissions::use());
        $permissions = $this->warden()->getDisplayPermissionList();
        return ResponseMaker::generate($permissions);
    }

    public function getGroup(int $groupID)
    {
        $this->warden_authorize(ShowGroup::use());
        $group = Group::findOrFail($groupID);
        return ResponseMaker::generate($group);
    }

    public function save(AddGroupRequest $request)
    {
        $data = $request->safe()->toArray();

        $group = new Group();
        $group->name = $data['name'];
        $group->permissions = $data['permissions'];
        $group->save();

        return ResponseMaker::generate([], 200, 'Group generated successfully!');
    }

    public function update(UpdateGroupRequest $request)
    {
        $data = $request->safe()->toArray();
        $group = Group::findOrFail($data['id']);

        $group->name = $data['name'];
        $group->permissions = $data['permissions'];
        $group->save();

        $this->warden()->invalidate(
            $group
                ->users()
                ->get()
                ->pluck('id')
                ->toArray()
        );

        return ResponseMaker::generate([], 200, 'Group updated successfully!');
    }

    public function delete(DeleteGroupRequest $request)
    {
        $id = $request->safe()['id'];

        $group = Group::findOrFail($id);
        $this->warden()->invalidate(
            $group
                ->users()
                ->get()
                ->pluck('id')
                ->toArray()
        );
        $group->delete();
        return ResponseMaker::generate([], 200, 'Group deleted successfully!');
    }
}

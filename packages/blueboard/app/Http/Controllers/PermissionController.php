<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\PermissionManager\PermissionHelper;
use App\Helpers\ResponseMaker;
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

	public function getGroup($groupID)
	{
		$this->checkPermission('viewgroup');
		$group = UserGroup::findOrFail($groupID);
		return ResponseMaker::generate($group);
	}

	public function save(Request $request, PermissionHelper $permissionHelper)
	{
		$this->checkPermission('update');
		$data = $request->validate(
			[
				'name' => ['required', 'string', 'max:255', 'unique:user_groups'],
				'permissions' => ['required', 'array'],
			],
			[
				'permissions.required' => 'Please select at least one permission.',
				'name.required' => 'Please enter a name for the group.',
				'name.unique' => 'This group already exists.',
			]
		);

		try {
			$permissionHelper->validatePermissions($data['permissions']);
		} catch (\Exception $e) {
			throw ValidationException::withMessages(["<strong>{$e->getFile()}</strong>", $e->getMessage()]);
		}

		$group = new UserGroup();
		$group->name = $data['name'];
		$group->permissions = $data['permissions'];
		$group->save();

		return ResponseMaker::generate([], 200, 'Group generated successfully!');
	}

	public function update(Request $request, PermissionHelper $permissionHelper)
	{
		$this->checkPermission('update');
		$id = $request->validate([
			'id' => ['required', 'integer'],
		])['id'];
		$group = UserGroup::findOrFail($id);

		$data = $request->validate(
			[
				'name' => ['required', 'string', 'max:255', 'unique:user_groups,name,' . $id],
				'permissions' => ['required', 'array'],
			],
			[
				'permissions.required' => 'Please select at least one permission.',
				'name.required' => 'Please enter a name for the group.',
				'name.unique' => 'This group already exists.',
			]
		);

		try {
			$permissionHelper->validatePermissions($data['permissions']);
		} catch (\Exception $e) {
			throw ValidationException::withMessages(["<strong>{$e->getFile()}</strong>", $e->getMessage()]);
		}

		$group->name = $data['name'];
		$group->permissions = $data['permissions'];
		$group->save();

		return ResponseMaker::generate([], 200, 'Group updated successfully!');
	}

	public function delete(Request $request)
	{
		$this->checkPermission('delete');
		$id = $request->validate([
			'id' => ['required', 'integer'],
		])['id'];
		$group = UserGroup::findOrFail($id);
		$group->delete();
		return ResponseMaker::generate([], 200, 'Group deleted successfully!');
	}
}

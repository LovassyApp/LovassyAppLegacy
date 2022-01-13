<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\UserGroup;
use App\Helpers\PermissionManager\PermissionHelper;
use App\Helpers\PermissionManager\Permissions;

class CreateUserGroupsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('user_groups', function (Blueprint $table) {
			$table->id();
			$table->timestamps();
			$table->string('name');
			$table->longText('permissions');
		});

		$group = new UserGroup();
		$group->name = 'Default (user)';
		$group->permissions = Permissions::getAllPermissions();
		$group->save();
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('user_groups');
	}
}

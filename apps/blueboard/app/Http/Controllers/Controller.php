<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Helpers\PermissionManager\PermissionHelper;
use Exception;
use Illuminate\Container\Container;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected string $permissionScope;

    public function __construct()
    {
        // Nothing, since apparently controllers are also singletons... WHAT THE FUCK?
        // Nice one, octane
    }

    protected function permissionHelper(): PermissionHelper
    {
        $con = Container::getInstance();
        $helper = $con->make(PermissionHelper::class);
        return $helper;
    }

    protected function checkPermission(string $permission)
    {
        if (!isset($this->permissionScope)) {
            throw new Exception("Please specify a 'permissionScope' property on your controller.");
        }
        $scope = $this->permissionScope;
        $permissionString = "$scope.$permission";

        $this->permissionHelper()->authorize($permissionString);
    }
}

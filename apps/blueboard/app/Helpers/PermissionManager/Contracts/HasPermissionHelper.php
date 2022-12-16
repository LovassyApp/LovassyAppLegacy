<?php

namespace App\Helpers\PermissionManager\Contracts;

use App\Helpers\PermissionManager\PermissionHelper;
use Exception;
use Illuminate\Container\Container;

trait HasPermissionHelper
{
    protected string $permissionScope;

    protected function permissionHelper(): PermissionHelper
    {
        $con = Container::getInstance();
        $helper = $con->make(PermissionHelper::class);
        return $helper;
    }

    protected function checkPermission(string $permission, string $permissionScope = null)
    {
        if ($permissionScope == null && !isset($this->permissionScope)) {
            $name = class_basename($this);
            throw new Exception("Please specify a 'permissionScope' property on class {$name}.");
        }

        $scope = $permissionScope ?? $this->permissionScope;
        $permissionString = "$scope.$permission";

        return $this->permissionHelper()->authorize($permissionString);
    }
}

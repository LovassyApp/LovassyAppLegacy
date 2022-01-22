<?php

namespace App\Helpers\PermissionManager;

use App\Exceptions\AuthErrorException;
use App\Models\User;
use App\Helpers\PermissionManager\Permissions;
use Exception;
use Illuminate\Support\Collection;
use Auth;

/**
 * Class PermissionHelper
 * A small helper for permission / user group management
 * @package App\Helpers\PermissionManager
 *
 */
class PermissionHelper
{
    /**
     * PermissionHelper::SCOPES
     * Array of permission scopes
     */
    private const SCOPES = Permissions::SCOPES;

    private bool $isCached = false;

    private array $cache = [];

    private array $scopeCache = [];

    private array $permissionCache = [];

    private bool $userIsCached = false;

    private bool $isSuperAdmin = false;

    private User $user;

    private Collection $groups;

    private array $allPermissions;

    private function renderOutput(object $permission)
    {
        throw new AuthErrorException($permission->errorMessage, 403);
    }

    public function __construct(bool $isCached)
    {
        $this->isCached = $isCached;
    }

    /**
     *
     * Retrieve an array of permissions that corresponds to the chosen scope.
     * Uses an external class, Permissions.
     * Only used internally.
     * @internal PermissionHelper::retrieveScope
     * @param string $scopeKey
     * @return mixed
     */
    private function retrieveScope(string $scopeKey)
    {
        if ($this->isCached && isset($this->scopeCache[$scopeKey])) {
            return $this->scopeCache[$scopeKey];
        }

        $scopeName = self::SCOPES[$scopeKey];
        $scope = eval("return App\Helpers\PermissionManager\Permissions::$scopeName;");
        $this->scopeCache[$scopeKey] = $scope;
        return $scope;
    }

    /**
     *
     * Retrieve a permission object from the ACS.
     * This method accepts a special permissionString ("{Scope}.{permission}").
     * Also validates the permissionString.
     * @api PermissionHelper::getPermission
     * @param string $permissionString
     * @return object
     * @throws Exception
     *
     */
    public function getPermission(string $permissionString)
    {
        if ($this->isCached && isset($this->permissionCache[$permissionString])) {
            return $this->permissionCache[$permissionString];
        }

        $scope_string = '';
        $permission_string = '';

        try {
            $arr = explode('.', $permissionString);
            $scope_string = $arr[0];
            $permission_string = $arr[1];
        } catch (Exception $e) {
            throw new Exception("Invalid string $permissionString. Format: {scope}.{permission} ", 100, $e);
        }

        try {
            $scope = $this->retrieveScope($scope_string);
            $permission = $scope[$permission_string];
        } catch (Exception $e) {
            $line = $e->getLine();
            if ($line == 46 || $line == 78) {
                throw new Exception("Scope $scope_string doesn't exist.", 100, $e);
            } elseif ($line == 28) {
                throw new Exception("Permission $permission_string doesn't exist on scope $scope_string.");
            }
            throw $e;
        }
        $permission['permissionString'] = $permissionString;

        $this->permissionCache[$permissionString] = (object) $permission;

        return (object) $permission;
    }

    /**
     *
     * Returns an array out of the scope's permissions, only used internally.
     * @internal PermissionHelper::getAllScopePermissions
     * @param array $scope
     * @param string $scopeDisplayName
     * @return array
     * @throws Exception
     */
    private function getAllScopePermissions(array $scope, string $scopeDisplayName)
    {
        $keys = array_keys($scope);
        $ret = [];
        foreach ($keys as $permissionName) {
            $permissionString = "$scopeDisplayName.$permissionName";
            array_push($ret, $this->getPermission($permissionString));
        }

        return $ret;
    }

    /**
     *
     * Makes a list of ALL permissions in each scope, arranging them by scope.
     * Casts all arrays to instances of stdClass. BEWARE!
     * @api PermissionHelper::getDisplayPermissionList
     * @return array
     * @throws Exception
     */
    public function getDisplayPermissionList()
    {
        $all_permissions = [];

        foreach (self::SCOPES as $key => $scopeName) {
            $scope = $this->retrieveScope($key);
            $permissions = $this->getAllScopePermissions($scope, $key);
            $all_permissions[$scopeName] = (object) [
                'scopeDisplayName' => $key,
                'scopeName' => $scopeName,
                'permissions' => $permissions,
            ];
        }

        return $all_permissions;
    }

    /**
     * @api PermissionHelper::validatePermissions
     * Validates an array of permissionStrings.
     * @param array $permissionArray
     * @return bool
     * @throws Exception
     */
    public function validatePermissions(array $permissionArray)
    {
        foreach ($permissionArray as $permissionString) {
            $this->getPermission($permissionString);
        }
        return true;
    }

    private function cacheUser()
    {
        if (!$this->userIsCached) {
            $this->user = Auth::user();
            $this->groups = $this->user->groups()->get();
            $permissions_column = $this->groups->pluck('permissions')->toArray();
            $this->allPermissions = array_merge(...$permissions_column);
            $this->isSuperAdmin = in_array($this->user->email, config('app.supermails'));
        }
        $this->userIsCached = true;
    }

    public function getAllPermissions()
    {
        $this->cacheUser();
        return $this->allPermissions;
    }

    /**
     *
     * A function for authorizing permissions for the user.
     * Checks every group assigned to the user for the provided permissionString.
     * Either returns true / false, or throws an HttpException (403).
     * @api PermissionHelper::authorize
     * @param string $permissionString
     * @param bool $booleanOutput This determines whether or not you want HttpExceptions. Exceptions are thrown by default.
     * @param bool $skipSuperCheck Skips the SuperAdmin bypass. Useful in some special cases.
     * @return bool
     * @throws Exception
     */
    public function authorize(string $permissionString, bool $booleanOutput = false, bool $skipSuperCheck = false)
    {
        if ($this->isCached && isset($this->cache[$permissionString])) {
            return $this->cache[$permissionString];
        }

        $this->cacheUser();

        $permission = $this->getPermission($permissionString);

        if ($this->isSuperAdmin && !$skipSuperCheck) {
            return true;
        }

        $res = (bool) in_array($permissionString, $this->allPermissions);

        $this->cache[$permissionString] = $res;

        if ($booleanOutput) {
            return $res;
        }

        if (!$res) {
            $this->renderOutput($permission);
        } else {
            return true;
        }
    }

    /**
     * @api PermissionHelper::isSuperAdmin
     * A function for checking whether the current user is a SuperAdmin or not.
     * @return bool
     */
    public function isSuperAdmin()
    {
        $this->cacheUser();
        return $this->isSuperAdmin;
    }
}

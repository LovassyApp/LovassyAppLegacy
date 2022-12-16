<?php

namespace App\Http\Controllers;

use App\Helpers\PermissionManager\Contracts\HasPermissionHelper;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Helpers\PermissionManager\PermissionHelper;
use Exception;
use Illuminate\Container\Container;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests, HasPermissionHelper;
    public function __construct()
    {
        // Nothing, since apparently controllers are also singletons... WHAT THE FUCK?
        // Nice one, octane
    }
}

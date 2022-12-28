<?php

namespace App\Http\Controllers;

use App\Helpers\Warden\Contracts\WardenAuthorizer;
use App\Helpers\Warden\Contracts\AuthorizesWithWarden;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
class Controller extends BaseController implements AuthorizesWithWarden
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests, WardenAuthorizer;
    public function __construct()
    {
        // Nothing, since apparently controllers are also singletons... WHAT THE FUCK?
        // Nice one, octane
    }
}

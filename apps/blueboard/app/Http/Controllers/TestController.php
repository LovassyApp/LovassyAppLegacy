<?php

namespace App\Http\Controllers;

use App\Events\GlobalEvent;
use App\Events\ProductUpdated;
use App\Events\TestEvent;
use App\Events\UserGroupUpdated;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserGroup;

class TestController extends Controller
{
    // Kérlek ezt ne hagyd benne a productionben.
    // Előre is köszi: A múltbéli éned.
    public function index()
    {
        TestEvent::dispatch(User::find(1));
        GlobalEvent::dispatch();
        ProductUpdated::dispatch(Product::find(1));
        UserGroupUpdated::dispatch(UserGroup::find(1));
    }
}

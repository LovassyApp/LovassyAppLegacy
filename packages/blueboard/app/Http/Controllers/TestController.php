<?php

namespace App\Http\Controllers;

use App\Events\GlobalEvent;
use App\Events\TestEvent;
use Illuminate\Http\Request;
use App\Models\User;

class TestController extends Controller
{
	// Kérlek ezt ne hagyd benne a productionben.
	// Előre is köszi: A múltbéli éned.
	public function index()
	{
		TestEvent::dispatch(User::find(1));
		GlobalEvent::dispatch();
	}
}

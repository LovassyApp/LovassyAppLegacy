<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseMaker;
use Illuminate\Http\Request;

class VersionController extends Controller
{
	public function index()
	{
		return ResponseMaker::generate([
			'body' => 'Blueboard - Server for LovassyAPP',
			'version' => config('app.blueboard_version'),
		]);
	}
}

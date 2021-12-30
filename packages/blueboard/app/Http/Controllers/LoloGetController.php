<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\LibLolo\LoloGenerator;
use App\Helpers\LibLolo\LoloHelper;
use App\Helpers\ResponseMaker;
use Auth;

class LoloGetController extends Controller
{
	public function index(Request $request)
	{
		$refresh = (bool) $request->query('refresh', false);
		if ($refresh == true) {
			LoloHelper::updateGrades();
		}
		$gen = new LoloGenerator(Auth::user());
		$gen->generate();

		return ResponseMaker::generate(LoloHelper::getLolo());
	}
}

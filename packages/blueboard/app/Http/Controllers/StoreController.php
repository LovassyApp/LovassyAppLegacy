<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseMaker;
use App\Models\Product;
use Illuminate\Http\Request;

class StoreController extends Controller
{
	public function index()
	{
		$products = Product::allVisible();

		return ResponseMaker::generate($products);
	}
}

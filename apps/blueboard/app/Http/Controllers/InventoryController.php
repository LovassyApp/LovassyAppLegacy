<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseMaker;
use Auth;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $items = $user
            ->items()
            ->with(['product'])
            ->get();

        return ResponseMaker::generate($items);
    }
}

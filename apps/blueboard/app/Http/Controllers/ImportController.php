<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseMaker;
use App\Models\User;
use DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ImportController extends Controller
{
    public function index(): JsonResponse
    {
        $data = DB::table('users')
            ->select(['id', 'om_code_hashed', 'public_key_hex'])
            ->get()
            ->toArray();

        return ResponseMaker::generate($data, 200, 'Users queried successfully!');
    }
}

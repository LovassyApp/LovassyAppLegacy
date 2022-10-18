<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseMaker;
use App\Models\GradeImport;
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

    public function save(Request $request): JsonResponse
    {
        $data = $request->validate([
            'key_encrypted' => 'string|required',
            'message_encrypted' => 'string|required',
            'user_id' => 'integer|required|exists:users,id',
        ]);

        $user = User::findOrFail($data['user_id']);

        $import = new GradeImport();
        $import->encryption_key = $data['key_encrypted'];
        $import->user_id = $user->id;
        $import->json_encrypted = $data['message_encrypted'];
        $import->save();

        $user->import_available = true;
        $user->save();

        return ResponseMaker::generate([], 200, '');
    }
}

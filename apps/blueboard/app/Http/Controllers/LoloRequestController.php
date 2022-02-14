<?php

namespace App\Http\Controllers;

use App\Helpers\LibSession\SessionManager;
use App\Helpers\ResponseMaker;
use App\Models\LoloRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoloRequestController extends Controller
{
    public function index(): JsonResponse
    {
        $requests = LoloRequest::with('user')->get();

        return ResponseMaker::generate($requests);
    }

    public function show(): JsonResponse
    {
        $requests = SessionManager::user()
            ->requests()
            ->get();

        return ResponseMaker::generate($requests);
    }

    public function create(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:255'],
        ]);

        $user = SessionManager::user();

        $loloRequest = $user->requests()->create($data);

        return ResponseMaker::generate($loloRequest, 200, 'Request made successfully!');
    }

    public function update(Request $request): JsonResponse
    {
        $id = $request->validate([
            'id' => ['required', 'integer'],
        ])['id'];

        $loloRequest = LoloRequest::findOrFail($id);

        return ResponseMaker::generate($loloRequest);
    }
}

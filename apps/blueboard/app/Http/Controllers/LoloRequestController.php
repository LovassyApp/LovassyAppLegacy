<?php

namespace App\Http\Controllers;

use App\Events\LoloAmountUpdated;
use App\Exceptions\APIException;
use App\Exceptions\RequestOverruleException;
use App\Helpers\LibLolo\LoloGenerator;
use App\Helpers\LibLolo\LoloHelper;
use App\Helpers\LibSession\Services\SessionManager;
use App\Helpers\ResponseMaker;
use App\Models\LoloRequest;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LoloRequestController extends Controller
{
    protected string $permissionScope = 'Requests';

    public function index(): JsonResponse
    {
        $this->checkPermission('index');
        $requests = LoloRequest::with('user')->get();

        return ResponseMaker::generate($requests);
    }

    public function show(): JsonResponse
    {
        $this->checkPermission('view');
        $requests = SessionManager::user()
            ->requests()
            ->get();

        return ResponseMaker::generate($requests);
    }

    public function create(Request $request): JsonResponse
    {
        $this->checkPermission('new');
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:65535'],
        ]);

        $user = SessionManager::user();

        $loloRequest = $user->requests()->create($data);

        return ResponseMaker::generate($loloRequest, 200, 'Request made successfully!');
    }

    public function update(Request $request): JsonResponse
    {
        $this->checkPermission('overrule');
        $data = $request->validate(
            [
                'id' => ['required', 'integer'],
                'verdict' => ['required', 'integer', Rule::in([0, 1])],
                'loloAmount' => ['required_if:verdict,1', 'integer'],
            ],
            ['loloAmount.required_if' => 'The amount is required when accepting a request.']
        );

        $loloRequest = LoloRequest::with('user')
            ->where('id', $data['id'])
            ->first();

        if ($loloRequest->accepted_at !== null || $loloRequest->denied_at !== null) {
            throw new RequestOverruleException();
        }

        switch ($data['verdict']) {
            case 0:
                $loloRequest->denied_at = Carbon::now();
                $loloRequest->save();
                break;
            case 1:
                $loloRequest->accepted_at = Carbon::now();
                $loloRequest->save();
                LoloGenerator::saveRequest($data['loloAmount'], $loloRequest);

                LoloAmountUpdated::dispatch(
                    $loloRequest->user,
                    $loloRequest->user->balance,
                    $loloRequest->user
                        ->lolo()
                        ->with('grades')
                        ->get()
                        ->toArray()
                );
                break;

            default:
                throw new APIException('No such action.');
                break;
        }

        return ResponseMaker::generate($loloRequest, 200, 'Request saved successfully!');
    }
}

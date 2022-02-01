<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseMaker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Http;

class VersionController extends Controller
{
    public function index()
    {
        return ResponseMaker::generate([
            'message' => 'Blueboard - Server for LovassyAPP',
            'version' => config('app.blueboard_version'),
        ]);
    }

    public function status(): JsonResponse
    {
        try {
            $conn = Redis::connection();
            $conn->ping();
            $redisOnline = true;
        } catch (\Exception $e) {
            $redisOnline = true;
        }

        $dbOnline = false;
        try {
            if (DB::connection()->getPdo()) {
                $dbOnline = true;
            }
        } catch (\Exception $e) {
            $dbOnline = false;
        }

        $soketiOnline = false;
        try {
            $req = Http::get('http://soketi:9601');
            $res = $req->body();

            if ($res === 'OK') {
                $soketiOnline = true;
            }
        } catch (\Exception $e) {
            $soketiOnline = false;
        }

        $full = $dbOnline && $redisOnline && $soketiOnline;

        return ResponseMaker::generate(
            [
                'ready' => $full,
                'serviceStatus' => [
                    'database' => $dbOnline ? 'OK' : 'DOWN',
                    'cache' => $redisOnline ? 'OK' : 'DOWN',
                    'sockets' => $soketiOnline ? 'OK' : 'DOWN',
                ],
            ],
            $full ? 200 : 500,
            $full ? 'Ready for requests!' : 'Service error!'
        );
    }
}

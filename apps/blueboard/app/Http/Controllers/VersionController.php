<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseMaker;
use Illuminate\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Http;

class VersionController extends Controller
{
    const BLUEBOARD_VERSION = '2.1.1';

    // Don't @ me :)
    const MOTDS = [
        'Hát... Ez meg mi?',
        'Az a kibaszott redisz...',
        'The quick brown fox jumps over the lazy dog.',
        'Amúgy a Lorem Ipsum latin. Eskü.',
        'Pajzzsal hogy lehet egy atombombát túlélni?',
        'KÉK TÁBLA (mi a fasz?)',
        'Szeressük amúgy a Krétát.',
        'Lovassy a LEGJOBB :) (hehe)',
        'A strange game. The only winning move is not to play.',
        "Blueboard btw: Krétát kezelünk, tehát kötelező a tanszerrel kapcsolatos név. 'Tábla napló' (geez) még nincs, ezért Board, a Blue pedig hát... A Lovassy színe a kék, én meg basic vagyok... Szóval ja... Blueboard. (Jobb, mint a Kék tábla napló vagy idk)",
    ];

    public function index()
    {
        return ResponseMaker::generate(
            [
                'whoami' => 'Blueboard - Server for LovassyApp',
                'php_version' => PHP_VERSION,
                'laravel_version' => Application::VERSION,
                'blueboard_version' => self::BLUEBOARD_VERSION,
                'contributors' => ['minigyima', 'Xeretis'],
                'repository' => ['https://github.com/LovassyApp/LovassyApp/tree/master/apps/blueboard'],
                'motd' => self::MOTDS[array_rand(self::MOTDS, 1)],
            ],
            418,
            "I'm a teapot BTW :)"
        );
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

        //$full = false;

        return ResponseMaker::generate(
            [
                'ready' => $full,
                'serviceStatus' => [
                    'database' => $dbOnline ? 'OK' : 'DOWN',
                    'cache' => $redisOnline ? 'OK' : 'DOWN',
                    'sockets' => $soketiOnline ? 'OK' : 'DOWN',
                ],
            ],
            $full ? 200 : 503,
            $full ? 'Ready for requests!' : 'Service error!'
        );
    }
}

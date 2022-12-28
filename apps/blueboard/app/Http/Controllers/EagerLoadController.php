<?php

namespace App\Http\Controllers;

use App\Events\LoloAmountUpdated;
use App\Permissions\General\Grades;
use App\Permissions\General\Lolo;
use App\Permissions\Inventory\ViewInventory;
use App\Permissions\Requests\ViewRequests;
use App\Permissions\Store\ViewStore;
use App\Helpers\Warden\Services\Warden;
use App\Helpers\LibBackboard\BackboardAdapter;
use App\Helpers\LibBackboard\KretaGradeCategory;
use App\Helpers\LibCrypto\Services\EncryptionManager;
use App\Helpers\LibLolo\LoloGenerator;
use App\Helpers\LibLolo\LoloHelper;
use App\Helpers\LibSession\Services\SessionManager;
use App\Helpers\Shared\Utils\ResponseMaker;
use App\Models\Grade;
use App\Models\InventoryItem;
use App\Models\LoloRequest;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\SerializableClosure\SerializableClosure;
use Octane;

class EagerLoadController extends Controller
{
    private static function makeFrame(mixed $data, $error = false, $message = '')
    {
        return [
            'status' => $error ? 'Error' : 'Success',
            'message' => $message,
            'data' => $data,
        ];
    }

    private static function getGrades(string $hash, int $user_id)
    {
        $warden = new Warden(fn() => User::findOrFail($user_id), false);
        if (!$warden->authorize(Grades::use(), true)) {
            return self::makeFrame([], true, 'Unauthorized.');
        }

        $allGrades = Grade::where('user_id', $hash)
            ->where('evaluationType', KretaGradeCategory::interim)
            ->orderBy('date', 'desc')
            ->get()
            ->groupBy('subject')
            ->map(function ($item, $key) {
                return (object) [
                    'subject' => $key,
                    'grades' => $item,
                ];
            })
            ->values();

        return self::makeFrame($allGrades);
    }

    private static function getStore(int $user_id)
    {
        $warden = new Warden(fn() => User::findOrFail($user_id), false);
        if (!$warden->authorize(ViewStore::use(), true)) {
            return self::makeFrame([], true, 'Unauthorized.');
        }

        $products = Product::allVisible();
        return self::makeFrame($products);
    }

    private static function getInventory(int $user_id)
    {
        $warden = new Warden(fn() => User::findOrFail($user_id), false);
        if (!$warden->authorize(ViewInventory::use(), true)) {
            return self::makeFrame([], true, 'Unauthorized.');
        }

        $items = InventoryItem::where('user_id', $user_id)
            ->with(['product'])
            ->get();

        return self::makeFrame($items);
    }

    private static function getRequests(int $user_id)
    {
        $warden = new Warden(fn() => User::findOrFail($user_id), false);
        if (!$warden->authorize(ViewRequests::use(), true)) {
            return self::makeFrame([], true, 'Unauthorized.');
        }

        $requests = LoloRequest::where('user_id', $user_id)->get();

        return self::makeFrame($requests);
    }

    public function index(Request $request)
    {
        $refresh = (bool) $request->query('refresh', false);
        $warden = Warden::use();
        $user = SessionManager::user();
        $encryption_manager = EncryptionManager::use();
        $hash = $user->hash;
        $id = $user->id;

        if (($warden->authorize(Grades::use(), true) || $warden->authorize(Lolo::use(), true)) && $refresh) {
            $adapter = new BackboardAdapter($user, $encryption_manager);
            $adapter->tryUpdating();
        }

        $ret = Octane::concurrently([
            fn() => self::getGrades($hash, $id),
            fn() => self::getStore($id),
            fn() => self::getInventory($id),
            fn() => self::getRequests($id),
        ]);

        [$grades, $store, $inventory, $requests] = $ret;

        if ($warden->authorize(Lolo::use(), true)) {
            $gen = new LoloGenerator(SessionManager::user());
            $gen->generate();

            $loloRaw = LoloHelper::getLolo();
            LoloAmountUpdated::dispatch($loloRaw->user, $loloRaw->balance, $loloRaw->coins->toArray());
            $lolo = self::makeFrame($loloRaw);
        } else {
            $lolo = self::makeFrame([], true, 'Unauthorized');
        }

        return ResponseMaker::generate(
            (object) [
                'grades' => $grades,
                'lolo' => $lolo,
                'store' => $store,
                'inventory' => $inventory,
                'requests' => $requests,
            ]
        );
    }
}

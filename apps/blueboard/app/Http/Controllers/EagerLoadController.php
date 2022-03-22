<?php

namespace App\Http\Controllers;

use App\Events\LoloAmountUpdated;
use App\Helpers\LibKreta\Grades\KretaGradeCategory;
use App\Helpers\LibKreta\RetiLimit;
use App\Helpers\LibLolo\LoloGenerator;
use App\Helpers\LibLolo\LoloHelper;
use App\Helpers\LibSession\SessionManager;
use App\Helpers\PermissionManager\PermissionHelper;
use App\Helpers\ResponseMaker;
use App\Models\Grade;
use App\Models\InventoryItem;
use App\Models\LoloRequest;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
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

    private static function getGrades($helper, $hash)
    {
        if (!$helper->authorize('General.grades', true)) {
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

    private static function getStore($helper)
    {
        if (!$helper->authorize('Store.view', true)) {
            return self::makeFrame([], true, 'Unauthorized.');
        }

        $products = Product::allVisible();
        return self::makeFrame($products);
    }

    private static function getInventory($helper, $user_id)
    {
        if (!$helper->authorize('Inventory.view', true)) {
            return self::makeFrame([], true, 'Unauthorized.');
        }

        $items = InventoryItem::where('user_id', $user_id)
            ->with(['product'])
            ->get();

        return self::makeFrame($items);
    }

    private static function getRequests($helper, $user_id)
    {
        if (!$helper->authorize('Requests.view', true)) {
            return self::makeFrame([], true, 'Unauthorized.');
        }

        $requests = LoloRequest::where('user_id', $user_id)->get();

        return self::makeFrame($requests);
    }

    public function index(Request $request)
    {
        $refresh = (bool) $request->query('refresh', false);
        $helper = app(PermissionHelper::class);

        RetiLimit::useRateLimit(function() use ($helper, $refresh) {
            if (($helper->authorize('General.grades', true) || $helper->authorize('General.lolo', true)) && $refresh) {
                LoloHelper::updateGrades();
            }
        });

        $user = SessionManager::user();
        $hash = $user->hash;
        $id = $user->id;

        $ret = Octane::concurrently([
            fn () => self::getGrades($helper, $hash),
            fn () => self::getStore($helper),
            fn () => self::getInventory($helper, $id),
            fn () => self::getRequests($helper, $id),
        ]);

        [$grades, $store, $inventory, $requests] = $ret;

        if ($helper->authorize('General.lolo', true)) {
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

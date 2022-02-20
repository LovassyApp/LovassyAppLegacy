<?php

namespace App\Http\Controllers;

use App\Events\InventoryItemCreated;
use App\Exceptions\InsufficientFundsException;
use App\Exceptions\ProductOutOfStockException;
use App\Helpers\ResponseMaker;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Helpers\LibLolo\LoloHelper;
use App\Models\InventoryItem;
use App\Models\StoreHistory;
use Auth;

class StoreController extends Controller
{
    protected string $permissionScope = 'Store';

    public function index()
    {
        $this->checkPermission('view');
        $products = Product::allVisible();

        return ResponseMaker::generate($products);
    }

    public function buy(Request $request)
    {
        $this->checkPermission('buy');

        $id = $request->validate([
            'productId' => ['required', 'integer'],
        ])['productId'];
        $product = Product::findOrFail($id);

        $user = Auth::user();
        $userId = $user->id;

        $loloObj = LoloHelper::getLolo();

        if ($product->price > $loloObj->balance) {
            throw new InsufficientFundsException();
        }

        if ($product->quantity < 1) {
            throw new ProductOutOfStockException();
        }

        $history = new StoreHistory();
        $history->product_id = $product->id;
        $history->user_id = $userId;
        $history->reason = [
            'type' => 'store',
            'message' => 'Bazárban vársárolva',
        ];
        $history->save();

        $product->quantity = $product->quantity - 1;
        $product->save();

        $loloObj->spend($product->price);

        $item = new InventoryItem();
        $item->product_id = $product->id;
        $item->history_id = $history->id;
        $item->user_id = $userId;
        $item->save();

        $history->item_id = $item->id;
        $history->save();

        InventoryItemCreated::dispatch($user, $item->id);

        return ResponseMaker::generate([], 200, 'Item purchased successfully!');
    }
}

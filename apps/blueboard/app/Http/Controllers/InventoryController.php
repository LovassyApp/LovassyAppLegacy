<?php

namespace App\Http\Controllers;

use App\Events\InventoryItemUsed;
use App\Exceptions\APIException;
use App\Exceptions\InvalidCodeException;
use App\Exceptions\ItemAlreadyUsedException;
use App\Exceptions\NotYourItemException;
use App\Helpers\LibSession\Services\SessionManager;
use App\Helpers\ResponseMaker;
use App\Http\Requests\Inventory\UseItemRequest;
use App\Jobs\ItemUseNotifier;
use App\Models\QRCode;
use Carbon\Carbon;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    protected string $permissionScope = 'Inventory';

    private string $stringInputRules = 'required|string|max:255';
    private string $boolInputRules = 'required|boolean';

    public function index()
    {
        $this->checkPermission('view');
        $user = SessionManager::user();
        $items = $user
            ->items()
            ->with(['product'])
            ->get();

        return ResponseMaker::generate($items);
    }

    private function getQR(Request $request): QRCode
    {
        $codeRaw = $request->validate([
            'code' => ['required', 'string', 'max:768'],
        ])['code'];
        try {
            $payload = decrypt($codeRaw);
            $code = QRCode::where('secret', $payload->secret)->first();

            if ($code === null) {
                throw new \Exception();
            }
        } catch (\Exception $e) {
            throw new InvalidCodeException();
        }

        return $code;
    }

    public function validateCode(Request $request)
    {
        $this->checkPermission('validate', 'QRCode');

        $user = SessionManager::user();
        $code = $this->getQR($request);

        $items = $code
            ->products()
            ->with([
                'items' => function ($query) use ($user) {
                    return $query->where('user_id', $user->id)->with('product');
                },
            ])
            ->get()
            ->pluck('items')
            ->toArray();

        $items = array_merge(...$items);

        return ResponseMaker::generate(
            (object) [
                'codeName' => $code->name,
                'usableItems' => $items,
            ],
            200,
            'Code successfully validated.'
        );
    }

    public function useItem(UseItemRequest $request)
    {
        $itemID = $request->safe()['itemID'];

        // Current session's user
        $user = SessionManager::user();

        // Get the item and check if it's one of the user's items
        try {
            $item = $user
                ->items()
                ->with(['product', 'product.codes'])
                ->where('id', $itemID)
                ->first();

            if ($item === null) {
                throw new \Exception();
            }
        } catch (\Exception $e) {
            throw new NotYourItemException();
        }

        if (isset($item->used_at)) {
            throw new ItemAlreadyUsedException();
        }

        // Check if the supplied QRCode is paired to this item.
        if ($item->product->codeActivated) {
            $code = $this->getQR($request);
            $productIDs = $code
                ->products()
                ->get()
                ->pluck('id')
                ->toArray();

            $codeIsUsable = in_array($item->product->id, $productIDs);

            if (!$codeIsUsable) {
                throw new InvalidCodeException('This code cannot be used for this item.');
            }
        } else {
            $code = null;
        }

        $validateArray = [];

        if (count($item->product->inputs) !== 0) {
            $validateArray['inputs'] = 'required|array';
        }

        foreach ($item->product->inputs as $input) {
            switch ($input['type']) {
                case 'boolean':
                    $validateArray["inputs.{$input['name']}"] = $this->boolInputRules;
                    break;
                case 'textbox':
                    $validateArray["inputs.{$input['name']}"] = $this->stringInputRules;
                    break;

                default:
                    throw new APIException("No such input type: {$input['type']}", 500);
                    break;
            }
        }

        $inputs =
            $request->validate($validateArray, ['inputs.*.required' => 'This field is required.'])['inputs'] ?? [];

        $item->used_at = Carbon::now();
        $item->save();

        if ($inputs !== []) {
            $item->itemUse()->create([
                'values' => $inputs,
                'product_id' => $item->product->id,
                'item_id' => $item->id,
            ]);
            $item->save();
        }

        InventoryItemUsed::dispatch($user, $item);

        $job = new ItemUseNotifier($item, $user, $code);
        $job->dispatch($item, $user, $code);

        return ResponseMaker::generate($item, 200, 'Item used successfully!');
    }
}

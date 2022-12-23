<?php

namespace App\Http\Controllers;

use App\Exceptions\BadFileException;
use App\Exceptions\ImageNotFoundException;
use App\Helpers\Shared\Utils\ResponseMaker;
use App\Http\Requests\Product\CreateProductRequest;
use App\Http\Requests\Product\DeleteProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Response;
use Str;

class ProductController extends Controller
{
    protected string $permissionScope = 'Products';

    public function create(CreateProductRequest $request)
    {
        $data = $request->safe();

        $product = new Product();
        $this->save($data->toArray(), $product);

        // NEM.
        return ResponseMaker::generate([], 200, 'Product generated successfully!');
    }

    public function update(UpdateProductRequest $request)
    {
        $data = $request->safe();
        $product = Product::findOrFail($data['id']);
        $data = $this->save($data->toArray(), $product);

        return ResponseMaker::generate([], 200, 'Product updated successfully!');
    }

    private function save(array $data, Product $product)
    {
        // Mime type fuckery
        $mimes = ['.png' => 'image/png', '.jpg' => 'image/jpeg'];
        try {
            $info = getimagesize($data['image']);
            $mime = $info['mime'];
        } catch (\Exception $e) {
            throw new BadFileException();
        }

        // img mappa + 8 char random string + time + .jpg/.png
        $filename = 'img/' . Str::random(8) . '_' . time() . array_search($mime, $mimes);

        // TÁROLNIII
        try {
            Storage::put($filename, file_get_contents($data['image']));
        } catch (\Exception $e) {
            throw new BadFileException();
        }
        $product->name = $data['name'];
        $product->description = $data['description'];
        $product->markdownContent = $data['markdownContent'];
        $product->codeActivated = $data['codeActivated'];
        $product->price = $data['price'];
        $product->quantity = $data['quantity'];
        $product->inputs = $data['inputs'];
        $product->imageName = $filename;
        $product->visible = $data['visible'];
        $product->notified_mails = $data['notified_mails'] ?? '';
        $product->save();

        $codeVal = $data['codeActivated'] === true ? $data['codes'] ?? [] : [];
        $product->codes()->sync($codeVal);
        $product->notifiedGroups()->sync($data['notified_groups'] ?? []);
    }

    public function index()
    {
        $this->checkPermission('index');

        $products = Product::all();
        return ResponseMaker::generate($products);
    }

    public function show(int $productID)
    {
        $this->checkPermission('show');

        $product = Product::with('notifiedGroups')->findOrFail($productID);
        return ResponseMaker::generate($product);
    }

    public function delete(DeleteProductRequest $request)
    {
        $id = $request->safe()['id'];

        $code = Product::findOrFail($id);
        $code->delete();

        return ResponseMaker::generate([], 200, 'Product deleted successfully!');
    }

    public function view($productID)
    {
        $product = Product::findOrFail($productID);
        if (!Storage::exists($product->imageName)) {
            throw new ImageNotFoundException();
        }

        $image = Storage::get($product->imageName);
        $filename = str_replace('img/', '', $product->imageName);
        $mime = Storage::mimeType($product->imageName);

        return Response::make($image, 200, ['Content-Type' => $mime, 'X-LLGAPP-FILENAME' => $filename]);
    }
}

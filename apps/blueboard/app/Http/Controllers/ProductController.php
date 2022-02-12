<?php

namespace App\Http\Controllers;

use App\Exceptions\BadFileException;
use App\Exceptions\ImageNotFoundException;
use App\Helpers\ResponseMaker;
use App\Models\Product;
use App\Rules\Base64Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Response;
use Str;

class ProductController extends Controller
{
    protected string $permissionScope = 'Products';

    public function create(Request $request)
    {
        $this->checkPermission('create');

        // Good luck to anyone reading this.
        // K@rva validáció

        $data = $request->validate(
            [
                'name' => 'required|max:255|unique:products|string',
                'description' => 'required|max:255|string',
                'markdownContent' => 'required',
                'codeActivated' => 'required|boolean',
                'visible' => 'required|boolean',
                'codes' => 'required_if:codeActivated,true|array',
                'price' => 'required|numeric|min:0',
                'quantity' => 'required|numeric|min:0',
                'inputs' => 'nullable|array',
                // Jaj JSON valid kulcs regeksz
                // Fáj az agyam
                'inputs.*.name' => ['required', 'distinct', "regex:/^[a-z][a-z0-9_]*$/i"],
                'inputs.*.title' => 'required|distinct',
                'inputs.*.type' => ['required', Rule::in(['textbox', 'boolean'])],
                'image' => ['required', new Base64Image(10)],
            ],
            [
                'inputs.*.*.distinct' => 'The title and name must be unique.',
                'inputs.*.name.regex' => 'Allowed format: a...Z, 0...9, _',
                'inputs.*.type' => 'Invalid type supplied. Avalible types: textbox, boolean',
            ]
        );

        $product = new Product();
        $this->save($data, $product);

        // NEM.
        return ResponseMaker::generate([], 200, 'Product generated successfully!');
    }

    public function update(Request $request)
    {
        $this->checkPermission('update');

        // Need I say more?
        // nem.
        $id = $request->validate([
            'id' => ['required', 'integer'],
        ])['id'];
        $product = Product::findOrFail($id);
        $data = $request->validate(
            [
                'name' => ['required', 'string', 'max:255', 'unique:products,name,' . $id],
                'description' => 'required|max:255|string',
                'markdownContent' => 'required',
                'codeActivated' => 'required|boolean',
                'visible' => 'required|boolean',
                'codes' => 'required_if:codeActivated,true|array',
                'price' => 'required|numeric|min:0',
                'quantity' => 'required|numeric|min:0',
                'inputs' => 'nullable|array',
                // Jaj JSON valid kulcs regeksz
                // Fáj az agyam
                'inputs.*.name' => ['required', 'distinct', "regex:/^[a-z][a-z0-9_]*$/i"],
                'inputs.*.title' => 'required|distinct',
                'inputs.*.type' => ['required', Rule::in(['textbox', 'boolean'])],
                'image' => ['required', new Base64Image(10)],
            ],
            [
                'inputs.*.*.distinct' => 'The title and name must be unique.',
                'inputs.*.name.regex' => 'Allowed format: a...Z, 0...9, _',
                'inputs.*.type' => 'Invalid type supplied. Avalible types: textbox, boolean',
            ]
        );

        $this->save($data, $product);

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
        $product->save();

        $product->codes()->sync($data['codes']);
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

        $product = Product::findOrFail($productID);
        return ResponseMaker::generate($product);
    }

    public function delete(Request $request)
    {
        $this->checkPermission('delete');

        $id = $request->validate([
            'id' => ['required', 'integer'],
        ])['id'];

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

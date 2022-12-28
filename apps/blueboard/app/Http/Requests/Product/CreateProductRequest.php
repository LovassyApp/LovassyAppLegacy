<?php

namespace App\Http\Requests\Product;

use App\Permissions\Products\CreateProduct;
use App\Http\Requests\FormRequest as RequestsFormRequest;
use App\Rules\Base64Image;
use Illuminate\Validation\Rule;
use Spatie\ValidationRules\Rules\Delimited;

class CreateProductRequest extends RequestsFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->warden_authorize(CreateProduct::use());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */

    // Good luck to anyone reading this.
    // K@rva validáció
    public function rules()
    {
        return [
            'name' => 'required|max:255|unique:products|string',
            'description' => 'required|max:255|string',
            'markdownContent' => 'required',
            'codeActivated' => 'required|boolean',
            'visible' => 'required|boolean',
            'codes' => 'required_if:codeActivated,true|array',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|numeric|min:0',
            'inputs' => 'nullable|array',
            'notified_mails' => ['nullable', (new Delimited('email'))->min(1)],
            'notified_groups' => 'nullable|array',
            // Jaj JSON valid kulcs regeksz
            // Fáj az agyam
            'inputs.*.name' => ['required', 'distinct', "regex:/^[a-z][a-z0-9_]*$/i"],
            'inputs.*.title' => 'required|distinct',
            'inputs.*.type' => ['required', Rule::in(['textbox', 'boolean'])],
            'image' => ['required', new Base64Image(10)],
        ];
    }

    public function messages()
    {
        return [
            'inputs.*.*.distinct' => 'The title and name must be unique.',
            'inputs.*.name.regex' => 'Allowed format: a...Z, 0...9, _',
            'inputs.*.type' => 'Invalid type supplied. Avalible types: textbox, boolean',
        ];
    }
}

<?php

namespace App\Http\Requests\Product;

use App\Permissions\Products\UpdateProduct;
use App\Http\Requests\FormRequest as RequestsFormRequest;
use App\Rules\Base64Image;
use Illuminate\Validation\Rule;
use Spatie\ValidationRules\Rules\Delimited;

class UpdateProductRequest extends RequestsFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->warden_authorize(UpdateProduct::use());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        // Need I say more?
        // nem.
        return [
            'id' => ['required', 'integer'],
            'name' => ['required', 'string', 'max:255', 'unique:products,name,' . $this->id],
            'description' => 'required|max:255|string',
            'markdownContent' => 'required',
            'codeActivated' => 'required|boolean',
            'visible' => 'required|boolean',
            'codes' => 'required_if:codeActivated,true|array',
            'notified_groups' => 'nullable|array',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|numeric|min:0',
            'inputs' => 'nullable|array',
            'notified_mails' => ['nullable', (new Delimited('email'))->min(1)],
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

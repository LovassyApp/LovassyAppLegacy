<?php

namespace App\Http\Requests\Product;

use App\Permissions\Products\DeleteProduct;
use App\Http\Requests\FormRequest as RequestsFormRequest;

class DeleteProductRequest extends RequestsFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->warden_authorize(DeleteProduct::use());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'id' => ['required', 'integer'],
        ];
    }
}

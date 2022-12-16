<?php

namespace App\Http\Requests\Product;

use App\Http\Requests\FormRequest as RequestsFormRequest;

class DeleteProductRequest extends RequestsFormRequest
{
    protected string $permissionScope = 'Products';

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->checkPermission('delete');
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

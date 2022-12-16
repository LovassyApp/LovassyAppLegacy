<?php

namespace App\Http\Requests\Store;

use App\Http\Requests\FormRequest as RequestsFormRequest;

class BuyRequest extends RequestsFormRequest
{
    protected string $permissionScope = 'Store';

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->checkPermission('buy');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'productId' => ['required', 'integer'],
        ];
    }
}

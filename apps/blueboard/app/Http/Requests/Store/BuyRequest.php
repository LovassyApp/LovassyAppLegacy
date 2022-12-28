<?php

namespace App\Http\Requests\Store;

use App\Permissions\Store\BuyProduct;
use App\Http\Requests\FormRequest as RequestsFormRequest;

class BuyRequest extends RequestsFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->warden_authorize(BuyProduct::use());
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

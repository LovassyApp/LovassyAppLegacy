<?php

namespace App\Http\Requests\Inventory;

use App\Permissions\Inventory\UseItem;
use App\Http\Requests\FormRequest as RequestsFormRequest;

class UseItemRequest extends RequestsFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->warden_authorize(UseItem::use());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'itemID' => ['required', 'integer', 'exists:inventory_items,id'],
        ];
    }

    public function messages()
    {
        return [
            'itemID.exists' => "The selected item doesn't exist.",
        ];
    }
}

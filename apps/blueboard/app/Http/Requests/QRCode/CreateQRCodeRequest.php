<?php

namespace App\Http\Requests\QRCode;

use App\Http\Requests\FormRequest as RequestsFormRequest;

class CreateQRCodeRequest extends RequestsFormRequest
{
    protected string $permissionScope = 'QRCode';

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->checkPermission('add');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => ['required', 'max:255', 'string', 'unique:q_r_codes'],
            'email' => ['required', 'string', 'max:255', 'email'],
        ];
    }
}

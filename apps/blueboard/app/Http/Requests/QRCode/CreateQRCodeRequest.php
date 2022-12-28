<?php

namespace App\Http\Requests\QRCode;

use App\Permissions\QRCode\CreateQRCode;
use App\Http\Requests\FormRequest as RequestsFormRequest;

class CreateQRCodeRequest extends RequestsFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->warden_authorize(CreateQRCode::use());
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

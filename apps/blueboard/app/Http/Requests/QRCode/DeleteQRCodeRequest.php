<?php

namespace App\Http\Requests\QRCode;

use App\Permissions\QRCode\DeleteQRCode;
use App\Http\Requests\FormRequest as RequestsFormRequest;

class DeleteQRCodeRequest extends RequestsFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->warden_authorize(DeleteQRCode::use());
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

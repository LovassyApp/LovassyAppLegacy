<?php

namespace App\Http\Requests\Import;

use Illuminate\Foundation\Http\FormRequest;

class NewImportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'key_encrypted' => 'string|required',
            'message_encrypted' => 'string|required',
            'user_id' => 'integer|required|exists:users,id',
        ];
    }
}

<?php

namespace App\Http\Requests\Users;

use App\Permissions\Users\DeleteUser;
use App\Http\Requests\FormRequest as RequestsFormRequest;

class UserDeleteRequest extends RequestsFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->warden_authorize(DeleteUser::use());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'id' => ['required', 'integer', 'exists:users'],
        ];
    }
}

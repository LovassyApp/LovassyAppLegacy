<?php

namespace App\Http\Requests\Users;

use App\Permissions\Users\UpdateUser;
use App\Http\Requests\FormRequest as RequestsFormRequest;

class UserUpdateRequest extends RequestsFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->warden_authorize(UpdateUser::use());
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
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'regex:/(.*)lovassy\.edu\.hu$/i',
                'unique:users,email,' . $this->id,
            ],
            'groups' => ['nullable', 'array'],
        ];
    }
}

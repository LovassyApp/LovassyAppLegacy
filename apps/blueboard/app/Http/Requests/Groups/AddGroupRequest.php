<?php

namespace App\Http\Requests\Groups;

use App\Permissions\Permissions\CreateGroup;
use App\Http\Requests\FormRequest;
use App\Rules\IsPermission;

class AddGroupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->warden_authorize(CreateGroup::use());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:authorizable_groups'],
            'permissions' => ['required', 'array', new IsPermission($this->warden())],
        ];
    }

    public function messages()
    {
        return [
            'permissions.required' => 'Please select at least one permission.',
            'name.required' => 'Please enter a name for the group.',
            'name.unique' => 'This group already exists.',
        ];
    }
}

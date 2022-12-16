<?php

namespace App\Http\Requests\Groups;

use App\Http\Requests\FormRequest;
use App\Rules\IsPermission;

class AddGroupRequest extends FormRequest
{
    protected string $permissionScope = 'Permissions';

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
            'name' => ['required', 'string', 'max:255', 'unique:user_groups'],
            'permissions' => ['required', 'array', new IsPermission($this->permissionHelper())],
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

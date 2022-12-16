<?php

namespace App\Http\Requests\Groups;

use App\Http\Requests\FormRequest as RequestsFormRequest;
use App\Rules\IsPermission;

class UpdateGroupRequest extends RequestsFormRequest
{
    protected string $permissionScope = 'Permissions';

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->checkPermission('update');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'id' => ['required', 'integer', 'exists:user_groups'],
            'name' => ['required', 'string', 'max:255', 'unique:user_groups,name,' . $this->id],
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

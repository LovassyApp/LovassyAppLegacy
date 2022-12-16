<?php

namespace App\Http\Requests\Groups;

use App\Http\Requests\FormRequest as RequestsFormRequest;

class DeleteGroupRequest extends RequestsFormRequest
{
    protected string $permissionScope = 'Permissions';

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->checkPermission('delete');
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
        ];
    }
}

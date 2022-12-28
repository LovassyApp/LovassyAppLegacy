<?php

namespace App\Http\Requests\Groups;

use App\Permissions\Permissions\DeleteGroup;
use App\Http\Requests\FormRequest as RequestsFormRequest;

class DeleteGroupRequest extends RequestsFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->warden_authorize(DeleteGroup::use());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'id' => ['required', 'integer', 'exists:authorizable_groups'],
        ];
    }
}

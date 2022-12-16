<?php

namespace App\Http\Requests\LoloRequest;

use App\Http\Requests\FormRequest as RequestsFormRequest;

class CreateLoloRequestRequest extends RequestsFormRequest
{
    protected string $permissionScope = 'Requests';

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->checkPermission('new');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:65535'],
        ];
    }
}

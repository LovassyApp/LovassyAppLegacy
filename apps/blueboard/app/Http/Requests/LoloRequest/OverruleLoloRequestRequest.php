<?php

namespace App\Http\Requests\LoloRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OverruleLoloRequestRequest extends FormRequest
{
    protected string $permissionScope = 'Requests';

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->checkPermission('overrule');
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
            'verdict' => ['required', 'integer', Rule::in([0, 1])],
            'loloAmount' => ['required_if:verdict,1', 'integer'],
        ];
    }

    public function messages()
    {
        return [
            'loloAmount.required_if' => 'The amount is required when accepting a request.',
        ];
    }
}

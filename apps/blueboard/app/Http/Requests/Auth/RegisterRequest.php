<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            // 'Korlátok korláta'
            // De azért jobb a békesség
            'email' => ['required', 'string', 'email', 'max:255', 'regex:/(.*)lovassy\.edu\.hu$/i', 'unique:users'],
            'password' => ['required', 'max:255', 'string'],

            // La kréta
            'name' => ['required', 'string', 'max:255'],
            'om_code' => ['required', 'string', 'max:20'],
            // Nem volt jobb üzenet ötletem. Don't @ me.
        ];
    }

    public function messages()
    {
        return [
            'email.regex' => "Registration is only allowed for 'lovassy.edu.hu' E-mail addresses.",
        ];
    }
}

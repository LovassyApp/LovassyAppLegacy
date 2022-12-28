<?php

namespace App\Http\Requests;

use App\Helpers\Warden\Contracts\WardenAuthorizer;
use App\Helpers\Warden\Contracts\AuthorizesWithWarden;
use Illuminate\Foundation\Http\FormRequest as IlluminateFormRequest;

class FormRequest extends IlluminateFormRequest implements AuthorizesWithWarden
{
    use WardenAuthorizer;
}

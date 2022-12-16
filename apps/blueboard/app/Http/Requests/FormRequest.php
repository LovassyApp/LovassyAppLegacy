<?php

namespace App\Http\Requests;

use App\Helpers\PermissionManager\Contracts\HasPermissionHelper;
use Illuminate\Foundation\Http\FormRequest as IlluminateFormRequest;

class FormRequest extends IlluminateFormRequest
{
    use HasPermissionHelper;
}

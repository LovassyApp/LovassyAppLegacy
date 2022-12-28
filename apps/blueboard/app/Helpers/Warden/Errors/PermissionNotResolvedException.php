<?php

namespace App\Helpers\Warden\Errors;

use App\Exceptions\APIException;

/**
 * Thrown when a given permission cannot be resolved
 * @package Warden
 */
class PermissionNotResolvedException extends APIException
{
}

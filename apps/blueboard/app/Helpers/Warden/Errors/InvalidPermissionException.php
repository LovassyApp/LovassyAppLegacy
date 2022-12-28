<?php

namespace App\Helpers\Warden\Errors;

use App\Exceptions\APIException;

/**
 * Thrown when a supplied permission is invalid
 * @package Warden
 */
class InvalidPermissionException extends APIException
{
}

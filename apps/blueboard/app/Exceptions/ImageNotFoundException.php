<?php

namespace App\Exceptions;

class ImageNotFoundException extends APIException
{
	protected int $defaultCode = 404;
	protected string $defaultMessage = 'Image for product not found.';
}

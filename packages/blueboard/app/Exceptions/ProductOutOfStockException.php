<?php

namespace App\Exceptions;

class ProductOutOfStockException extends APIException
{
	protected int $defaultCode = 422;
	protected string $defaultMessage = 'This product is currently out of stock.';
}

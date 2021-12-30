<?php

namespace App\Helpers\LibKreta;

class Endpoints
{
	public const idp = [
		'nonce' => 'nonce',
		'token' => 'connect/token',
	];
	public const kreta = [
		'student' => '/ellenorzo/V3/Sajat/TanuloAdatlap',
		'evaluations' => '/ellenorzo/V3/Sajat/Ertekelesek',
	];
	public function __get($name)
	{
		return (object) eval("return self::$name;");
	}
}

<?php

namespace App\Helpers\LibKreta;

use App\Helpers\LibKreta\BaseKreta;

class Student extends BaseKreta
{
	private $token;
	private $decodedToken;
	private $institute;

	public function __construct($token)
	{
		parent::__construct();
		$this->token = $token;
		$this->decodedToken = $this->decodeToken($token);
		$this->institute = $this->decodedToken->attributes->{"kreta:institute_code"};
		$this->getData();
	}

	private function getData()
	{
		$url = $this->url($this->institute, 'api', $this->endpoints->kreta->student);
		$req = $this->makeGetRequest($url, [
			'Authorization' => "Bearer $this->token",
		]);
		$body = json_decode($req);
		dd($body);
		foreach (get_object_vars($body) as $key => $value) {
			$this->$key = $value;
		}
	}
}

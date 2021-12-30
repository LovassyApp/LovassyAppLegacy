<?php

namespace App\Helpers\LibKreta;

use stdClass;

class Evaluations extends BaseKreta
{
	private $token;
	private $decodedToken;
	private $institute;
	public $evaluations;

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
		$url = $this->url($this->institute, 'api', $this->endpoints->kreta->evaluations);
		$req = $this->makeGetRequest($url, [], true);
		$body = json_decode($req);
		$this->evaluations = $body;
	}

	/*
        Jej gusztustalan kreta response parser
    */
	public function parse(array $addArguments = [])
	{
		$arr = [];
		$data = $this->evaluations ?? [];
		foreach ($data as $grade) {
			$gradeObj = [
				'uid' => $grade->Uid,
				'date' => $grade->RogzitesDatuma,
				'subject' => ucfirst($grade->Tantargy->Nev),
				'teacher' => $grade->ErtekeloTanarNeve ?? 'Névtelen hős',
				'name' => $grade->Tema ?? 'Névtelen jegy',
				'type' => $grade->Mod->Leiras,
				'grade' => $grade->SzamErtek ?? 0,
				'gradeType' => $grade->Jelleg ?? 'Mi ez, hogy van jellege?',
				'gradeText' => $grade->SzovegesErtek ?? 'nem',
				'weight' => $grade->SulySzazalekErteke ?? 100,
			];

			$gradeObj = array_merge($gradeObj, $addArguments);

			array_push($arr, $gradeObj);
		}

		return $arr;
	}
}

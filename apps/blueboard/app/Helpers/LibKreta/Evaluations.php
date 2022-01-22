<?php

namespace App\Helpers\LibKreta;

use App\Helpers\LibKreta\Grades\KretaGrade;
use Carbon\Carbon;
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
    public function parse(array $additionalAttributes = [])
    {
        //dd($this);
        $arr = [];
        $data = $this->evaluations ?? [];
        foreach ($data as $grade) {
            // Mostmár ez gusztustalan
            $gradeObj = new KretaGrade($grade, $additionalAttributes);
            array_push($arr, $gradeObj->toArray());
        }

        return $arr;
    }
}

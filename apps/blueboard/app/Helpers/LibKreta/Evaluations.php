<?php

namespace App\Helpers\LibKreta;

use App\Exceptions\ExceptionRenderer;
use App\Exceptions\LibKreta\KretaCredentialException;
use App\Exceptions\LibKreta\KretaGeneralException;
use App\Exceptions\LibKreta\KretaTokenException;
use App\Helpers\LibKreta\Grades\KretaGrade;

/**
 * Krétás jegyeket kezelő izébizé (ismertebb nevén biszbasz)
 */
class Evaluations extends BaseKreta
{
    /**
     * @var array
     */
    public array $evaluations;
    /**
     * @var string
     */
    private string $token;
    /**
     * @var object
     */
    private object $decodedToken;
    /**
     * @var string
     */
    private string $institute;

    /**
     * @throws KretaGeneralException
     * @throws ExceptionRenderer
     * @throws KretaCredentialException
     * @throws KretaTokenException
     */
    public function __construct($token)
    {
        parent::__construct();
        $this->token = $token;
        $this->decodedToken = $this->decodeToken($token);
        //dd($token);
        $this->institute = $this->decodedToken->attributes->{"kreta:institute_code"};
        $this->getData();
    }

    /**
     * @throws KretaCredentialException
     * @throws KretaGeneralException
     * @throws ExceptionRenderer
     * @throws KretaTokenException
     *
     * API hívás
     */
    private function getData()
    {
        $url = $this->url($this->institute, 'api', $this->endpoints->kreta->evaluations);
        $req = $this->makeGetRequest($url, [], true);
        $body = json_decode($req);
        $this->evaluations = $body;
    }

    /**
     * @param array $additionalAttributes
     * @return array
     *
     * Jej gusztustalan kreta response parser
     */
    public function parse(array $additionalAttributes = []): array
    {
        //dd($this);
        $arr = [];
        $data = $this->evaluations ?? [];
        foreach ($data as $grade) {
            // Mostmár ez gusztustalan
            $gradeObj = new KretaGrade($grade, $additionalAttributes);
            $arr[] = $gradeObj->toArray();
        }

        return $arr;
    }
}

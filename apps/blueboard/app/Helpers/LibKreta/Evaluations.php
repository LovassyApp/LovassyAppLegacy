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
    public function __construct(string $token)
    {
        parent::__construct();
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
     * Jej gusztustalan KRÉTA response parser
     * * Needless to say, not my finest work...
     *
     * @param array $additionalAttributes
     * @return array
     *
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

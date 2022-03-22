<?php

namespace App\Helpers\LibKreta;

use App\Exceptions\LibKreta\KretaCredentialException;
use App\Exceptions\LibKreta\KretaGeneralException;
use App\Exceptions\LibKreta\KretaTokenException;
use Exception;
use JetBrains\PhpStorm\ArrayShape;
use stdClass;

/**
 *  Kréta hitelesítés kezelő valami
 *  Csak és kizárólag saját felelősségre
 */
class Auth extends BaseKreta
{
    /**
     * @var stdClass
     * A szerver teljes válasza
     */
    public stdClass $body;
    /**
     * @var string
     * Iskola krétás azonosítója
     */
    private string $instituteCode;
    /**
     * @var string
     * Diák felhasználóneve
     */
    private string $username;
    /**
     * @var string
     * Diák jelszava
     */
    private string $password;

    /**
     * @param $instituteCode
     * @param $username
     * @param $password
     */
    public function __construct($instituteCode, $username, $password)
    {
        parent::__construct();
        $this->instituteCode = $instituteCode;
        $this->username = $username;
        $this->password = $password;
    }

    /**
     * Ellenőrzi a megadott felhasználónév / jelszó páros helyességét a Kréta szervereken
     *
     * @param string $username
     * @param string $password
     * @return stdClass
     * @throws KretaCredentialException
     * @throws KretaTokenException
     * @throws KretaGeneralException
     */
    public static function verifyCredentials(string $username, string $password): stdClass
    {
        $auth = new self(config('kreta.institute_code'), $username, $password);
        $res = $auth->login();

        if (isset($res->error) && $res->error == 'invalid_grant') {
            throw new KretaCredentialException('Invalid Kreta credentials!', 401);
        }

        return $res;
    }

    /**
     * Login request
     *
     * @return mixed
     * @throws KretaTokenException
     * @throws KretaGeneralException
     */
    public function login(): stdClass
    {
        $form = [
            'username' => $this->username,
            'password' => $this->password,
            'institute_code' => $this->instituteCode,
            'grant_type' => 'password',
            'client_id' => $this->clientID,
        ];

        list($req, $body) = $this->makeLoginRequest($form);

        if (!isset($body->access_token) && !isset($body->error_description)) {
            throw new KretaTokenException($req->body());
        }

        // életkedvnövelés kell most pls ide
        if (isset($body->access_token)) {
            $this->body->decoded = $this->decodeToken($body->access_token);
        }

        return $this->body;
    }

    /**
     * Nyers login request.
     *
     * @param array $form
     * @return array
     * @throws KretaGeneralException
     * @throws Exception
     */
    private function makeLoginRequest(array $form): array
    {
        $headers = $this->encodeNonce($this->username, $this->instituteCode);
        $url = $this->url($this->instituteCode, 'auth', $this->endpoints->idp->token);

        $req = $this->makePostRequest($url, $form, $headers);
        $body = json_decode($req->body());
        $this->body = $body;
        return [$req, $body];
    }

    /**
     * KRÉTA Nonce generátor.
     * khm. nemszép.
     *
     * @param $username
     * @param $instituteCode
     * @return array
     * @throws KretaGeneralException
     */
    #[
        ArrayShape([
            'X-AuthorizationPolicy-Nonce' => 'string',
            'X-AuthorizationPolicy-Key' => 'string',
            'X-AuthorizationPolicy-Version' => 'string',
        ])
    ]
    private function encodeNonce($username, $instituteCode): array {
        // Normál GET request minden nélkül
        $nonce = $this->getNonceReq($this->url($this->instituteCode, 'auth', $this->endpoints->idp->nonce));

        // Enkódoolt meszidzs
        $message = strtolower($username) . strtolower($instituteCode) . $nonce;

        // ezt át kellene rakni valahova máshova lol
        // Thx filc
        $key = '5Kmpmgd5fJ';

        // La *érdekes* hmac hash
        // Miért?
        $sign = hash_hmac('sha512', $message, $key, true);
        $base64 = base64_encode($sign);

        return [
            'X-AuthorizationPolicy-Nonce' => $nonce,
            'X-AuthorizationPolicy-Key' => $base64,
            /*
                Ugye nem lesz több verzió?
                Ugye nem
                NE
            */
            'X-AuthorizationPolicy-Version' => 'v1',
        ];
    }

    /*
       Ez nem megy, IDK miert, de most nem fogok vele szenvedni
       TODO: Ezt actually működésre bírni
    */

    /**
     * Token refresh thing
     *
     * @param string $refreshToken
     * @return mixed
     * @throws KretaGeneralException
     */
    public function refreshToken(string $refreshToken): stdClass
    {
        $form = [
            'refresh_token' => $refreshToken,
            'institute_code' => $this->instituteCode,
            'grant_type' => 'refresh_token',
            'client_id' => $this->clientID,
        ];

        list($req, $body) = $this->makeLoginRequest($form);

        return $this->body;
    }
}

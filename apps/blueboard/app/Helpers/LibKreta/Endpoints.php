<?php

namespace App\Helpers\LibKreta;

/**
 * Nagyon kevés KRÉTA végpontot tartalmazó *valami*
 */
class Endpoints
{
    /**
     * Kréta IDP hitelesítő endpointok
     */
    public const idp = [
        'nonce' => 'nonce',
        'token' => 'connect/token',
    ];
    /**
     * (erősen hiányos) Kréta endpointok
     */
    public const kreta = [
        'student' => '/ellenorzo/V3/Sajat/TanuloAdatlap',
        'evaluations' => '/ellenorzo/V3/Sajat/Ertekelesek',
    ];

    /**
     * @param $name
     * @return object
     * Varázslaaaaat
     */
    public function __get($name)
    {
        return (object) eval("return self::$name;");
    }
}

<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Kreta Intézmény
    |--------------------------------------------------------------------------
    |
    | A LibKreta nevezetű csoda által használt Kréta Instance azonosítója
    | Default: Lovassy László Gimnázium
    |
    */
    'institute_code' => env('KRETA_INSTITUTE', 'klik037169001'),

    /*
    |--------------------------------------------------------------------------
    | User agent
    |--------------------------------------------------------------------------
    |
    | A LibKreta nevezetű csoda által használt user agent
    |
    */
    'user_agent' => env('KRETA_USER_AGENT', 'com.llgapp.blueboard'),
];

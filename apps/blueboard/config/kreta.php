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

    /*
    |--------------------------------------------------------------------------
    | Rate limit: Órák száma
    |--------------------------------------------------------------------------
    |
    | A RétiLimit (trédmárk) ennyi időnként engedi a Blueboard számára a KRÉTA API hívásokat
    |
    */
    'rate_limit_hours' => (int) env('KRETA_RATE_LIMIT_HOURS', 12),
];

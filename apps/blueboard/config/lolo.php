<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Ötös generálási threshold
    |--------------------------------------------------------------------------
    |
    | A LoLó generátor ennyi ötös után ír jóvá egy LoLó-t
    | Default: 3
    |
    */
    'five_threshold' => (int) env('LOLO_5_THRESHOLD', 3),

    /*
    |--------------------------------------------------------------------------
    | Négyes generálási threshold
    |--------------------------------------------------------------------------
    |
    | A LoLó generátor ennyi négyes után ír jóvá egy LoLó-t
    | Default: 5
    |
    */
    'four_threshold' => (int) env('LOLO_4_THRESHOLD', 5),

    /*
    |--------------------------------------------------------------------------
    | Ötös reason
    |--------------------------------------------------------------------------
    |
    | A LoLó generátor ötösökből generált LoLó-khoz társított üzenete
    |
    */
    'five_reason' => env('LOLO_5_REASON', 'Ötösökből automatikusan generálva.'),

    /*
    |--------------------------------------------------------------------------
    | Négyes reason
    |--------------------------------------------------------------------------
    |
    | A LoLó generátor ötösökből generált LoLó-khoz társított üzenete
    |
    */
    'four_reason' => env('LOLO_4_REASON', 'Négyesekből automatikusan generálva.'),

    /*
    |--------------------------------------------------------------------------
    | Kérvény reason
    |--------------------------------------------------------------------------
    |
    | A LoLó generátor kérvényekért kapott LoLó-khoz zársított üzenete
    |
    */
    'request_reason' => env('LOLO_REQUEST_REASON', 'LoLó kérvényből jóváírva.'),

    /*
    |--------------------------------------------------------------------------
    | Lock prefix
    |--------------------------------------------------------------------------
    |
    | A generátor belső atomic lock prefix-e
    |
    */
    'lock_prefix' => 'lologen-',
];

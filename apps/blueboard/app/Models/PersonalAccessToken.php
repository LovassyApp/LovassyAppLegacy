<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as BaseModel;

class PersonalAccessToken extends BaseModel
{
    use \Spiritix\LadaCache\Database\LadaCacheTrait;
}

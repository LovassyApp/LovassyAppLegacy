<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KretaCred extends Model
{
    use \Spiritix\LadaCache\Database\LadaCacheTrait;
    use HasFactory;
}

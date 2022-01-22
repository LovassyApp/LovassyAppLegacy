<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreHistory extends Model
{
    use \Spiritix\LadaCache\Database\LadaCacheTrait;
    use HasFactory;

    protected $casts = [
        'reason' => AsArrayObject::class,
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GradeImport extends Model
{
    use \Spiritix\LadaCache\Database\LadaCacheTrait;
    use HasFactory;
}

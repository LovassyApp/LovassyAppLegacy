<?php

namespace App\Models;

use App\Events\UserGroupUpdated;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserGroup extends Model
{
    use \Spiritix\LadaCache\Database\LadaCacheTrait;
    use HasFactory;

    protected $casts = [
        'permissions' => AsArrayObject::class,
    ];

    public static function boot()
    {
        parent::boot();
        static::saved(function ($group) {
            UserGroupUpdated::dispatch($group);
        });
    }
}

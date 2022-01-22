<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;

class Lolo extends Model
{
    use \Spiritix\LadaCache\Database\LadaCacheTrait;
    use HasFactory;

    protected $guarded = '';

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class, 'lolo_id', 'id');
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    protected $casts = [
        'reason' => AsArrayObject::class,
    ];

    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope('order', function (Builder $builder) {
            $builder->orderBy('created_at', 'asc');
        });
    }
}

<?php

namespace App\Models;

use App\Events\ProductUpdated;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;
use URL;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use \Spiritix\LadaCache\Database\LadaCacheTrait;
    use HasFactory;

    protected $appends = ['imageUrl', 'codeNames'];

    public function getImageUrlAttribute()
    {
        return URL::signedRoute('productimage', [
            'productID' => $this->id,
        ]);
    }

    public static function boot()
    {
        parent::boot();

        static::updated(function ($product) {
            ProductUpdated::dispatch($product);
        });
    }

    public function getCodeNamesAttribute()
    {
        return $this->codes()
            ->get()
            ->pluck('name');
    }

    public function codes(): BelongsToMany
    {
        return $this->belongsToMany(QRCode::class, 'product_code', 'product_id', 'code_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(InventoryItem::class);
    }

    protected $casts = [
        'inputs' => AsArrayObject::class,
    ];

    protected $with = ['codes'];

    public static function allVisible(): Collection
    {
        return self::setEagerLoads([])
            ->where('visible', 1)
            ->get();
    }
}

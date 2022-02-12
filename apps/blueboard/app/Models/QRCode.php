<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use URL;

class QRCode extends Model
{
    use \Spiritix\LadaCache\Database\LadaCacheTrait;
    use HasFactory;

    protected $appends = ['image'];

    public function getImageAttribute()
    {
        return URL::signedRoute('qrimage', [
            'image' => $this->id,
        ]);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_code', 'code_id', 'product_id');
    }
}

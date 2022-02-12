<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryItem extends Model
{
    use \Spiritix\LadaCache\Database\LadaCacheTrait;
    use HasFactory;

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /*public function history(): BelongsTo
    {
        return $this->belongsTo(StoreHistory::class, 'history_id');
    }*/
}

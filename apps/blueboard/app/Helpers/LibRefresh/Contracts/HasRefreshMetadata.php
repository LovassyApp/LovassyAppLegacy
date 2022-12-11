<?php

namespace App\Helpers\LibRefresh\Contracts;

use App\Helpers\LibRefresh\Models\RefreshMetadata;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait HasRefreshMetadata
{
    /**
     * HasOne relation for the model and its metadata
     *
     * @return MorphOne
     */
    public function metadata(): MorphOne
    {
        return $this->morphOne(RefreshMetadata::class, 'metadata_owner');
    }
}

<?php

namespace App\Helpers\Warden\Contracts;

use App\Helpers\Warden\Models\AuthorizableGroup;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

/**
 * The behavioural implementation for Authorizable models
 * @package Warden
 */
trait AuthorizableBehaviour
{
    /**
     * Relationship containing the AuthorizableGroups assigned to this user
     *
     * @return MorphToMany
     */
    public function groups(): MorphToMany
    {
        return $this->morphToMany(AuthorizableGroup::class, 'authorizable');
    }
}

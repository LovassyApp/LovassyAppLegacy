<?php

namespace App\Helpers\Warden\Contracts;

use Illuminate\Database\Eloquent\Relations\MorphToMany;
/**
 * The interface used for Authorizable models
 * @package Warden
 */
interface Authorizable
{
    /**
     * Relationship containing the AuthorizableGroups assigned to this user
     *
     * @return MorphToMany
     */
    public function groups(): MorphToMany;
}

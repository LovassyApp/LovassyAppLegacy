<?php

namespace App\Models;

use App\Events\UserGroupUpdated;
use App\Helpers\Warden\Models\AuthorizableGroup;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Group extends AuthorizableGroup
{
    public static function boot()
    {
        parent::boot();
        static::saved(function ($group) {
            UserGroupUpdated::dispatch($group);
        });
    }

    public function users(): MorphToMany
    {
        return $this->morphedByMany(
            User::class,
            'authorizable',
            'authorizables',
            'authorizable_group_id',
            'authorizable_id'
        );
    }
}

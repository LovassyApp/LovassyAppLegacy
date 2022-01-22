<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\KretaCred;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    use \Spiritix\LadaCache\Database\LadaCacheTrait;
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = ['name', 'email', 'password'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token'];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the KretaCred associated with the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function kreta(): HasOne
    {
        return $this->hasOne(KretaCred::class, 'user_id', 'id');
    }

    /**
     * The channels the user receives notification broadcasts on.
     *
     * @return string
     */
    public function receivesBroadcastNotificationsOn()
    {
        return 'App.Models.User.' . $this->id;
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class, 'user_id', 'id');
    }

    public function lolo(): HasMany
    {
        return $this->hasMany(Lolo::class, 'user_id', 'id');
    }

    public function groups()
    {
        return $this->belongsToMany(UserGroup::class, 'user_group', 'user_id', 'group_id');
    }

    protected $with = ['lolo'];
    protected $appends = ['balance', 'groups'];

    public function getBalanceAttribute()
    {
        return $this->lolo()
            ->where('isSpent', 0)
            ->count();
    }

    public function getGroupsAttribute()
    {
        return $this->groups()
            ->get()
            ->pluck('id');
    }
}

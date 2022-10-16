<?php

namespace App\Models;

use App\Helpers\LibCrypto\Services\EncryptionManager;
use App\Helpers\LibSession\Services\SessionManager;
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
    protected $hidden = ['password', 'remember_token', 'hash'];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'kreta_update_timestamp' => 'datetime',
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
        return 'Users.' . $this?->id;
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class, 'user_id', 'hash');
    }

    public function lolo(): HasMany
    {
        return $this->hasMany(Lolo::class, 'user_id', 'id');
    }

    public function groups()
    {
        return $this->belongsToMany(UserGroup::class, 'user_group', 'user_id', 'group_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(InventoryItem::class);
    }

    public function requests()
    {
        return $this->hasMany(LoloRequest::class);
    }

    protected $with = ['lolo'];
    protected $appends = ['balance', 'hash' /*'groups'*/];

    public function getBalanceAttribute()
    {
        return $this->lolo()
            ->where('isSpent', 0)
            ->count();
    }

    public function getHashAttribute()
    {
        if ($this?->id === SessionManager::user()?->id) {
            return EncryptionManager::use()->hash((string) $this?->id, 'user');
        } else {
            return '';
        }
    }

    /*public function getGroupsAttribute()
    {
        return $this->groups()
            ->get()
            ->pluck('id');
    }*/
}

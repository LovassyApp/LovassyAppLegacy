<?php

namespace App\Models;

use App\Helpers\Warden\Contracts\Authorizable;
use App\Helpers\Warden\Contracts\AuthorizableBehaviour;
use App\Helpers\LibCrypto\Services\HashManager;
use App\Helpers\LibSession\Services\SessionManager;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Helpers\LibRefresh\Contracts\HasRefreshTokens;

class User extends Authenticatable implements Authorizable
{
    use \Spiritix\LadaCache\Database\LadaCacheTrait;
    use HasApiTokens, HasFactory, Notifiable, HasRefreshTokens, AuthorizableBehaviour;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'om_code_hashed',
        'om_code_encrypted',
        'public_key_hex',
        'private_key_encrypted',
        'master_key_encrypted',
        'hasher_salt_encrypted',
        'hasher_salt_hashed',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
        'hash',
        'private_key_encrypted',
        'om_code_encrypted',
        'public_key_hex',
        'om_code_hashed',
        'master_key_encrypted',
        'hasher_salt_encrypted',
        'hasher_salt_hashed',
    ];

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

    public function imports(): HasMany
    {
        return $this->hasMany(GradeImport::class, 'user_id', 'id');
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
            return HashManager::use()->hash_salted((string) $this?->id, 'user');
        } else {
            return '';
        }
    }
}

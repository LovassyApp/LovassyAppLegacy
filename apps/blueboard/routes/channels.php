<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('Users.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('Store', function ($user) {
    return Auth::user() === $user;
});

Broadcast::channel('Groups.{id}', function ($user, $id) {
    return $user
        ->groups()
        ->where('authorizables.authorizable_group_id', (int) $id)
        ->exists();
});

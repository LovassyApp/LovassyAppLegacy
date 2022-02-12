<?php

namespace App\Events;

use App\Models\UserGroup;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserGroupUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private UserGroup $group;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(UserGroup $group)
    {
        $this->group = $group;
    }

    public function broadcastWith()
    {
        return [
            'group' => $this->group,
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('Groups.' . $this->group->id);
    }
}

<?php

namespace App\Events;

use App\Models\Group;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserGroupNotification
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private Group|null $group = null;
    private string $title = '';
    private string $body = '';

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Group $group, string $title, string $body)
    {
        $this->group = $group;
        $this->title = $title;
        $this->body = $body;
    }

    public function broadcastWith(): array
    {
        return [
            'title' => $this->title,
            'body' => $this->body,
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

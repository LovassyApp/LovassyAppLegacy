<?php

namespace App\Events;

use App\Models\InventoryItem;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class InventoryItemUsed implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private User $user;
    private InventoryItem $item;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(User $user, InventoryItem $item)
    {
        $this->user = $user;
        $this->item = $item;
    }

    public function broadcastWith()
    {
        return [
            'item' => $this->item,
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('Users.' . $this->user->id);
    }
}

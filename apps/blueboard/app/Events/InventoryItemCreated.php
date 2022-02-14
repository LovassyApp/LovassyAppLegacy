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

class InventoryItemCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private User $user;
    private InventoryItem $item;

    /**
     * Create a new event instance.
     *
     * Query a constructorban. Nem szép, de nem akartam lassítani a store-t, + nem akarok mégegy jobot erre indítani. Sosumi.
     * @return void
     */
    public function __construct(User $user, int $itemID)
    {
        $this->user = $user;
        $this->item = InventoryItem::with('product')
            ->where('id', $itemID)
            ->first();
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

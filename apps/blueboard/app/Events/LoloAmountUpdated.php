<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LoloAmountUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private User $user;
    private int $newAmount;
    private array $coins;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(User $user, int $amount, array $coins)
    {
        $this->user = $user;
        $this->newAmount = $amount;
        $this->coins = $coins;
    }

    public function broadcastWith()
    {
        return [
            'balance' => $this->newAmount,
            'coins' => $this->coins,
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

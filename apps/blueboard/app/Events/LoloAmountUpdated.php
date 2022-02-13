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

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(User $user, int $amount)
    {
        $this->user = $user;
        $this->newAmount = $amount;
    }

    public function broadcastWith()
    {
        return [
            'balance' => $this->newAmount,
            'coins' => $this->user->lolo()->with('grades')->get(),
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

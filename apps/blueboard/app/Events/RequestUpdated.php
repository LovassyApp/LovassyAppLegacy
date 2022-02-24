<?php

namespace App\Events;

use App\Models\LoloRequest;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RequestUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private LoloRequest $request;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(LoloRequest $request)
    {
        $this->request = $request;
    }

    public function broadcastWith()
    {
        return [
            'requests' => $this->request->user->requests()->get(),
            'request' => $this->request,
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('Users.' . $this->request->user->id);
    }
}

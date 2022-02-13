<?php

namespace App\Mail;

use App\Models\InventoryItem;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ProductUsedMail extends Mailable
{
    use Queueable, SerializesModels;

    private InventoryItem|null $item = null;
    private User|null $user = null;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(InventoryItem $item, User $user)
    {
        $this->item = $item;
        $this->user = $user;
        $this->subject('Termék felhasználva');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mail.productUsed', ['item' => $this->item, 'user' => $this->user]);
    }
}

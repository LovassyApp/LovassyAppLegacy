<?php

namespace App\Jobs;

use App\Mail\ProductUsedMail;
use App\Models\InventoryItem;
use App\Models\QRCode;
use App\Models\User;
use App\Models\UserGroup;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;

/*
    Queue job for sending notification emails and dispatching real-time notifications for using an item
*/

class ItemUseNotifier implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private QRCode|null $code = null;
    private InventoryItem|null $item = null;
    private Collection|null $notifiedGroups = null;
    private User|null $user = null;

    // All users who have the permission to view a given use should be notified.
    private string $notifiedPermission = 'Products.uses';

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(InventoryItem $item, User $user, QRCode|null $code = null)
    {
        $this->notifiedGroups = $this->getNotifiedGroups();
        $this->item = $item;
        $this->code = $code;
        $this->user = $user;
    }

    private function getNotifiedGroups(): Collection
    {
        return UserGroup::where('permissions', 'like', '%' . $this->notifiedPermission . '%')->get();
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // TODO
        //dd($this->notifiedGroups)

        // Array for all notified E-mail addresses
        $emailArray = [];

        $product = $this->item
            ->product()
            ->with('notifiedGroups')
            ->first();

        foreach ($product->notifiedGroups ?? [] as $group) {
            $mails = $group
                ->users()
                ->get()
                ->pluck('email')
                ->toArray();
            $emailArray = array_merge($emailArray, $mails);
        }

        $notifiedMails = explode(',', $product->notified_mails);
        $emailArray = array_merge($emailArray, $notifiedMails);

        // Send mail to notified person fronm code
        if (isset($this->code)) {
            array_push($emailArray, $this->code->email);
        }

        // Unique array
        $emailArray = array_merge(array_flip(array_flip($emailArray)));

        // Send emails
        if (!empty($emailArray)) {
            Mail::bcc($emailArray)->send(new ProductUsedMail($this->item, $this->user));
        }
    }
}

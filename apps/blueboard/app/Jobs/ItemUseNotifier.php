<?php

namespace App\Jobs;

use App\Helpers\PermissionManager\Permissions;
use App\Models\InventoryItem;
use App\Models\QRCode;
use App\Models\UserGroup;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

/*
    Queue job for sending notification emails and dispatching real-time notifications for using an item
*/
class ItemUseNotifier implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private QRCode|null $code = null;
    private InventoryItem|null $item = null;
    private Collection|null $notifiedGroups = null;

    // All users who have the permission to view a given use should be notified.
    private string $notifiedPermission = 'Products.uses';

    private function getNotifiedGroups(): Collection
    {
        return UserGroup::where('permissions', 'like', '%' . $this->notifiedPermission . '%')->get();
    }

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(InventoryItem $item, QRCode|null $code = null)
    {
        $this->notifiedGroups = $this->getNotifiedGroups();
        $this->item = $item;
        $this->code = $code;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // TODO
        //dd($this->notifiedGroups);
    }
}

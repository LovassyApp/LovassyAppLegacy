<?php

namespace App\Console\Commands;

use App\Helpers\Warden\Contracts\ResolvesCacheDriver;
use Illuminate\Console\Command;

class FlushWardenCache extends Command
{
    use ResolvesCacheDriver;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'warden:flush';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Flushes the configured CacheDriver for Warden';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $driver = self::newWarmCacheDriver();
        $driver->flush();

        $this->info('Cache flushed');

        return Command::SUCCESS;
    }
}

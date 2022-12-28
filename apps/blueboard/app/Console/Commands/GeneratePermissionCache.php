<?php

namespace App\Console\Commands;

use App\Helpers\Warden\Cache\ColdCacheBuilder;
use Illuminate\Console\Command;

/**
 * A Small command for rebuilding Warden's permission cache
 * @package Warden
 */
class GeneratePermissionCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'warden:build';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Builds an Access Control List for Warden';

    /**
     * Generate and save the permission cache to the pre-determined location.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('# Retrieving Permission Classes...');
        $cache_writer = new ColdCacheBuilder();
        $this->info('# Processing Permission classes...');
        echo PHP_EOL;

        $this->withProgressBar($cache_writer->classes, function ($permission) use ($cache_writer) {
            $cache_writer->processClass($permission);
        });
        echo PHP_EOL . PHP_EOL;

        $this->info('# Writing cache output...');
        $cache_writer->write();

        $this->info('# Cache generation finished. Have a nice day :)');

        return Command::SUCCESS;
    }
}

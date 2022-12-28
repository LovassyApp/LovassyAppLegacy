<?php

namespace App\Helpers\Shared\Utils;

use Swoole\Http\Server;
use Illuminate\Support\Facades\App;

class CheckForSwoole
{
    /**
     * Name of the extension to check for
     * @var string
     */
    private static string $extension = 'openswoole';

    /**
     * Check loaded extensions
     * @return bool
     */
    public static function check(): bool
    {
        return extension_loaded(self::$extension) && !App::runningInConsole() && app()->bound(Server::class);
    }
}

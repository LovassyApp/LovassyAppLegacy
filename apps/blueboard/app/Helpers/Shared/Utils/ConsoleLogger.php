<?php

namespace App\Helpers\Shared\Utils;

class ConsoleLogger
{
    public static function log_info(string $message, string $sender = 'Blueboard'): void
    {
        $logMsg = date('Y-m-d H:i:s') . " # $sender: $message\n";
        fwrite(STDERR, $logMsg);
    }

    public static function log_success(string $message, string $sender = 'Blueboard'): void
    {
        $logMsg = date('Y-m-d H:i:s') . " # $sender: $message\n";
        fwrite(STDERR, "\033[32m$logMsg");
    }

    public static function log_warning(string $message, string $sender = 'Blueboard'): void
    {
        $logMsg = date('Y-m-d H:i:s') . " # $sender: $message\n";
        fwrite(STDERR, "\033[33m$logMsg");
    }

    public static function log_error(string $message, string $sender = 'Blueboard'): void
    {
        $logMsg = date('Y-m-d H:i:s') . " # $sender: $message\n";
        fwrite(STDERR, "\033[31m$logMsg");
    }
}

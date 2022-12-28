<?php

namespace App\Helpers\Warden\Interfaces;

/**
 * An abstract class for Persistent cache implementations
 * @package Warden
 */
abstract class PersistCacheDriver
{
    /**
     * Rebuild and write the cache
     *
     * @return void
     */
    abstract public static function rebuild(): void;

    /**
     * Process a given Permission class
     *
     * @param string $class_name
     * @return void
     */
    abstract public function processClass(string $class_name): void;

    /**
     * Write the cache
     *
     * @return void
     */
    abstract public function write(): void;
}

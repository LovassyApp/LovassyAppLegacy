<?php

namespace App\Helpers\LibCrypto\Interfaces;

interface EncryptableKeyInterface
{
    public function __construct(string|null $key_encrypted = null);
    public function lock(string $password, string $salt): string;
    public function unlock(string $password, string $salt): void;
    public function key(): string;
}

<?php

namespace App\Helpers\LibSession\Interfaces;

use App\Models\User;

interface SessionInterface
{
    public function toJson(): string;
    public function __construct(string $hash);
    public static function start(string $hash, int $expiry, string $salt, string $user_salt): self;
    public function all(): object;
    public function __unset(string $name): void;
    public function __set(string $name, mixed $value): void;
    public function __get(string $name): mixed;
}

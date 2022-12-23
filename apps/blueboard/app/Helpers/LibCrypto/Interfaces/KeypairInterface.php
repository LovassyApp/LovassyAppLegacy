<?php

namespace App\Helpers\LibCrypto\Interfaces;

abstract class KeypairInterface
{
    abstract public function __construct(string|null $privateKey);
    public readonly string $privateKey;
    public readonly string $publicKey_hex;
    protected string $publicKey;
    abstract public function decrypt(string $ciphertext_hex): string;
    abstract public function encrypt(string $message_hex): string;
}

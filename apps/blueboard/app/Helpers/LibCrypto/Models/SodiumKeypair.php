<?php

namespace App\Helpers\LibCrypto\Models;

class SodiumKeypair
{
    public readonly string $privateKey;
    public readonly string $publicKey_hex;
    private string $publicKey;

    public function __construct(string|null $privateKey)
    {
        if (is_null($privateKey)) {
            $privateKey = sodium_crypto_box_keypair();
        }

        $this->privateKey = $privateKey;
        $this->publicKey = sodium_crypto_box_publickey($privateKey);
        $this->publicKey_hex = bin2hex($this->publicKey);
    }

    public function decrypt(string $ciphertext_hex): string
    {
        return sodium_crypto_box_seal_open(hex2bin($ciphertext_hex), $this->privateKey);
    }

    public function encrypt(string $message_hex): string
    {
        return bin2hex(sodium_crypto_box_seal($message_hex, $this->publicKey));
    }
}

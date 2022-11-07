<?php

namespace App\Helpers\LibCrypto\Models;
/**
 * Asszimetrikus titkosításhoz használt Sodium helper class
 *
 * Egy kulcspár akar lenni
 */
class SodiumKeypair
{
    /**
     * Privát kulcs
     *
     * @var string
     */
    public readonly string $privateKey;
    /**
     * Publikus kulcs, hex-ben tárolva
     *
     * @var string
     */
    public readonly string $publicKey_hex;
    /**
     * Publikus kulcs
     *
     * @var string
     */
    private string $publicKey;

    /**
     * Kulcspár constructor
     *
     * @param string|null $privateKey
     * Privát kulcs. Ha nincs megadva, új kulcspárt generál
     */
    public function __construct(string|null $privateKey)
    {
        if (is_null($privateKey)) {
            $privateKey = sodium_crypto_box_keypair();
        }

        $this->privateKey = $privateKey;
        $this->publicKey = sodium_crypto_box_publickey($privateKey);
        $this->publicKey_hex = bin2hex($this->publicKey);
    }

    /**
     * Hexadecimálisban megadott CryptoBox-ot old fel
     *
     * @param string $ciphertext_hex
     * @return string
     */
    public function decrypt(string $ciphertext_hex): string
    {
        return sodium_crypto_box_seal_open(hex2bin($ciphertext_hex), $this->privateKey);
    }

    /**
     * Hexadecimálissá konvertált CryptoBox-ot generál, egy hexadecimális üzenetből
     *
     * @param string $message_hex
     * @return string
     */
    public function encrypt(string $message_hex): string
    {
        return bin2hex(sodium_crypto_box_seal($message_hex, $this->publicKey));
    }
}

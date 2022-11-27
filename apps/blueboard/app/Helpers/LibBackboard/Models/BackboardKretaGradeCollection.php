<?php

namespace App\Helpers\LibBackboard\Models;

use App\Models\User;
use Illuminate\Encryption\Encrypter;

class BackboardKretaGradeCollection
{
    private string $key_encrypted;
    private string $key;

    public function __construct(
        public readonly User $user,
        public readonly string $school_class,
        public readonly string $student_name,
        public readonly array $grades
    ) {
    }

    private function generateKey()
    {
        $this->key = openssl_random_pseudo_bytes(32);
        $public_key = hex2bin($this->user->public_key_hex);
        $encrypted_bytes = sodium_crypto_box_seal($this->key, $public_key);
        $this->key_encrypted = bin2hex($encrypted_bytes);
    }

    private function toJson(): string
    {
        return json_encode($this);
    }

    public function makeMessage(bool $json = true): string|object
    {
        $this->generateKey();
        $encryptor = new Encrypter($this->key, 'aes-256-cbc');
        $enc = $encryptor->encryptString($this->toJson());
        $message = (object) [
            'key_encrypted' => $this->key_encrypted,
            'message_encrypted' => $enc,
            'user_id' => $this->user->id,
        ];

        if ($json) {
            return json_encode($message);
        } else {
            return $message;
        }
    }
}

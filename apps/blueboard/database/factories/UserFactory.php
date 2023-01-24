<?php

namespace Database\Factories;

use App\Helpers\LibCrypto\Models\MasterKey;
use App\Helpers\LibCrypto\Models\SodiumKeypair;
use App\Helpers\LibCrypto\Services\EncryptionManager;
use App\Helpers\LibCrypto\Services\HashManager;
use App\Models\User;
use Hash;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    private static string $password = 'password';

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'password' => Hash::make(self::$password),
            'email' => $this->faker->unique()->word() . '@lovassy.edu.hu',
            'om_code_hashed' => Str::random(30),
            'om_code_encrypted' => '',
            'public_key_hex' => '',
            'master_key_encrypted' => '',
            'private_key_encrypted' => '',
            'hasher_salt_encrypted' => '',
            'hasher_salt_hashed' => Str::random(16),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (User $user) {
            $salt = EncryptionManager::generateSalt();
            $key = new MasterKey();
            $stored_key = $key->lock(self::$password, $salt);
            $man = EncryptionManager::boot_register($key);
            $keys = new SodiumKeypair(null);
            $omcode = Str::random(20);

            $hasher_salt = EncryptionManager::generateSalt();

            $user->om_code_hashed = HashManager::hash($omcode);
            $user->om_code_encrypted = $man->encrypt($omcode);
            $user->public_key_hex = $keys->publicKey_hex;
            $user->master_key_encrypted = $stored_key;
            $user->private_key_encrypted = $man->encrypt($keys->privateKey);
            $user->hasher_salt_hashed = HashManager::hash($hasher_salt);
            $user->hasher_salt_encrypted = $man->encrypt($hasher_salt);
            $user->save();

            $user->groups()->sync([1]);
            EncryptionManager::saveSalt($salt, $user->id);
        });
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function unverified()
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
            ];
        });
    }
}

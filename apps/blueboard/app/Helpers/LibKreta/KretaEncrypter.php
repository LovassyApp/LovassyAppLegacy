<?php

namespace App\Helpers\LibKreta;

use App\Exceptions\LibKreta\KretaCredentialException;
use App\Helpers\LibCrypto\Services\EncryptionManager;
use App\Models\KretaCred;
use App\Models\User;
use Illuminate\Encryption\Encrypter;
use Illuminate\Support\Facades\Auth;

/**
 * KRÉTÁS adatokat titkosító izébizé
 * jaj au klenz
 */
class KretaEncrypter
{
    /**
     * @var Encrypter
     */
    private Encrypter $encrypter;
    /**
     * @var User
     */
    private User $user;

    /**
     * @param string $key
     * @param null $user
     */
    public function __construct(string $key, $user = null)
    {
        if ($user == null) {
            $user = Auth::user();
        }
        $this->encrypter = new Encrypter($key, 'aes-256-gcm');
        $this->user = $user;
    }

    /**
     * Az adatbázisban eltárolt titkosított hitelesító adatokat feloldja, visszaadja
     * Ha bebasz a gebasz (értsd: Nincs krétás adat elrárolva) akkor exceptiont dob
     *
     * @return object
     * @throws KretaCredentialException
     *
     */
    public function getCreds(): object
    {
        $creds = $this->user->kreta()->first();

        if ($creds == null) {
            throw new KretaCredentialException();
        }

        // Tovább tovább tovább...
        return (object) [
            'username' => $this->encrypter->decrypt($creds->username),
            'password' => $this->encrypter->decrypt($creds->password),
            'token' => $creds->token != null ? $this->encrypter->decrypt($creds->token) : null,
            'refreshToken' => $creds->refreshToken != null ? $this->encrypter->decrypt($creds->refreshToken) : null,
        ];
    }

    /**
     * Letitkosítja, majd eltárolja a felhasználónév / jelszó kombót
     *
     * @param string $username
     * @param string $password
     * @throws KretaCredentialException
     *
     */
    public function store(string $username, string $password)
    {
        if ($this->user->kreta != null) {
            throw new KretaCredentialException('KRETA credentials already set. Please use update() instead.');
        }

        $cred = new KretaCred();
        $cred->username = $this->encrypter->encrypt($username);
        $cred->password = $this->encrypter->encrypt($password);

        $this->user->kreta()->save($cred);
    }

    /**
     * Gusztustalan fostalicska
     * * A célnak megfelel, de pfuj
     *
     * @param object $creds
     */
    public function update(object $creds)
    {
        $cred = $this->user->kreta()->first();

        $cred->username = isset($creds->username) ? $this->encrypter->encrypt($creds->username) : $cred->username;
        $cred->password = isset($creds->password) ? $this->encrypter->encrypt($creds->password) : $cred->password;
        $cred->token = isset($creds->token) ? $this->encrypter->encrypt($creds->token) : $cred->token;
        $cred->refreshToken = isset($creds->refreshToken)
            ? $this->encrypter->encrypt($creds->refreshToken)
            : $cred->refreshToken;

        $cred->save();
    }

    public static function use(): self
    {
        $encryption_manager = EncryptionManager::use();
        return new self($encryption_manager->getKey());
    }
}

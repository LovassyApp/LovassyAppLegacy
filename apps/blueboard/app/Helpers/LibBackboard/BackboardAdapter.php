<?php

namespace App\Helpers\LibBackboard;

use App\Helpers\LibBackboard\Errors\InvalidImportException;
use App\Helpers\LibCrypto\Models\SodiumKeypair;
use App\Helpers\LibCrypto\Services\EncryptionManager;
use App\Models\Grade;
use App\Models\User;
use Cache;
use Exception;
use Illuminate\Cache\Lock;
use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Encryption\Encrypter;
use stdClass;

class BackboardAdapter
{
    private User $user;
    private EncryptionManager $encryption_manager;
    private array $rawGrades;
    private array $parsedGrades;
    private Lock $lock;

    private static string $lockNamePrefix = 'BackboardAdapter-';

    public function __construct(User $user, EncryptionManager $encryption_manager)
    {
        $this->lock = Cache::lock(self::$lockNamePrefix . $user->id, 10);
        $this->user = $user;
        $this->encryption_manager = $encryption_manager;
    }

    private function getUpdatedGrades(): stdClass|false
    {
        if (!(bool) $this->user->import_available) {
            return false;
        }

        if (!$this->lock->get()) {
            return false;
        }

        $import = $this->user
            ->imports()
            ->orderBy('id', 'desc')
            ->first();

        $key = EncryptionManager::use()->decrypt($this->user->private_key_encrypted);
        $keypair = new SodiumKeypair($key);
        $aeskey = $keypair->decrypt($import->encryption_key);
        $enc = new Encrypter($aeskey, 'aes-256-cbc');

        return json_decode($enc->decryptString($import->json_encrypted));
    }

    private function updateClass(stdClass $gradeObject)
    {
        try {
            if (!isset($this->user->class)) {
                $this->user->class = $gradeObject->school_class;
                $this->user->save();
            }
        } catch (Exception $e) {
            throw new InvalidImportException('The imported data provided is invalid.', 500, $e);
        }
    }

    private function parse(stdClass $gradeObject): array
    {
        $additional = ['user_id' => $this->user->hash];
        try {
            $rawGrades = $gradeObject->grades;
            $array = [];
            foreach ($rawGrades as $grade) {
                array_push($array, (new KretaGrade($grade, $additional))->toArray());
            }
        } catch (Exception $ex) {
            dd($ex);
            throw new InvalidImportException('The imported data provided is invalid.', 500, $ex);
        }

        return $array;
    }

    public function tryUpdating()
    {
        $gradeObject = $this->getUpdatedGrades();
        if ($gradeObject === false) {
            return;
        }

        $this->updateClass($gradeObject);

        $parsed = $this->parse($gradeObject);
        Grade::upsert($parsed, ['uid']);

        $this->user->import_available = false;
        $this->user->save();

        $this->user->imports()->delete();
    }

    public function __destruct()
    {
        $this->lock->release();
    }
}

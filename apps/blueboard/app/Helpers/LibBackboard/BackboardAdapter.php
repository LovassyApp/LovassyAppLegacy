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
use Illuminate\Encryption\Encrypter;
use stdClass;

/**
 * Egy helper class a Backboard-tól kapott feltöltések kezelésére
 */
class BackboardAdapter
{
    /**
     * Jelenlegi *júzer*
     *
     * @var User
     */
    private User $user;
    /**
     * Userhez tartozó titkosító cucc
     *
     * @var EncryptionManager
     */
    private EncryptionManager $encryption_manager;
    /**
     * Nyers, nem feldolgozott jegyek
     *
     * @var array
     */
    private array $rawGrades;
    /**
     * Feldolgozott *naonszíp* jegyek
     *
     * @var array
     */
    private array $parsedGrades;
    /**
     * Lock, hogy egyszerre csak egy szálon indulhasson el az adapter
     *
     * @var Lock
     */
    private Lock $lock;
    /**
     * Prefix a Lock nevéhez
     *
     * @var string
     */
    private static string $lockNamePrefix = 'BackboardAdapter-';

    /**
     * Konsztráktor. Semmi érdekes. Lockolja az adott adaptert egy szálra, a biztonság kedvéért
     *
     * @param User $user
     * @param EncryptionManager $encryption_manager
     */
    public function __construct(User $user, EncryptionManager $encryption_manager)
    {
        $this->lock = Cache::lock(self::$lockNamePrefix . $user->id, 10);
        $this->user = $user;
        $this->encryption_manager = $encryption_manager;
    }

    /**
     * (Ha van) Feloldja, majd parseolja a legújabb feltöltést
     *
     * @return stdClass|false
     */
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

        $key = $this->encryption_manager->decrypt($this->user->private_key_encrypted);
        $keypair = new SodiumKeypair($key);
        $aeskey = $keypair->decrypt($import->encryption_key);
        $enc = new Encrypter($aeskey, 'aes-256-cbc');

        return json_decode($enc->decryptString($import->json_encrypted));
    }

    /**
     * Ha van a feltöltésben Osztály, akkor azt beállítja az adott usernek
     *
     * @param stdClass $gradeObject
     * @return void
     */
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

    /**
     * Feldolgozza a jegyeket, kicsit szebb formátumba, KretaGrade classokba
     *
     * @param stdClass $gradeObject
     * @return array
     */
    private function parse(stdClass $gradeObject): array
    {
        $additional = ['user_id' => $this->user->hash];
        try {
            $this->rawGrades = $gradeObject->grades;
            $array = [];
            foreach ($this->rawGrades as $grade) {
                array_push($array, (new KretaGrade($grade, $additional))->toArray());
            }
        } catch (Exception $ex) {
            dd($ex);
            throw new InvalidImportException('The imported data provided is invalid.', 500, $ex);
        }

        return $array;
    }

    /**
     * *Próbálkozik* a jegyek frissítésével
     *
     * @return void
     */
    public function tryUpdating()
    {
        $gradeObject = $this->getUpdatedGrades();
        if ($gradeObject === false) {
            return;
        }

        $this->updateClass($gradeObject);

        $this->parsedGrades = $this->parse($gradeObject);
        Grade::upsert($this->parsedGrades, ['uid']);

        $this->user->import_available = false;
        $this->user->save();

        $this->user->imports()->delete();
    }

    /**
     * Destruktor, csak oldja a lokkot
     *
     * *KÉT KÁ IKSZDÉ*
     */
    public function __destruct()
    {
        $this->lock->release();
    }
}

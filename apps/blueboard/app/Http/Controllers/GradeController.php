<?php

namespace App\Http\Controllers;

use App\Helpers\LibBackboard\BackboardAdapter;
use App\Helpers\LibBackboard\KretaGradeCategory;
use App\Helpers\LibCrypto\Services\EncryptionManager;
//use App\Helpers\LibKreta\RetiLimit;
use Illuminate\Http\Request;
use App\Helpers\LibSession\Services\SessionManager;
use App\Helpers\ResponseMaker;

class GradeController extends Controller
{
    protected string $permissionScope = 'General';

    public function index()
    {
        $this->checkPermission('grades');

        $user = SessionManager::user();
        $encryption_manager = EncryptionManager::use();

        $adapter = new BackboardAdapter($user, $encryption_manager);
        $adapter->tryUpdating();

        $allGrades = $user
            ->grades()
            ->where('evaluationType', KretaGradeCategory::interim)
            ->orderBy('date', 'desc')
            ->get()
            ->groupBy('subject')
            ->map(function ($item, $key) {
                return (object) [
                    'subject' => $key,
                    'grades' => $item,
                ];
            })
            ->values();
        return ResponseMaker::generate($allGrades);
    }
}

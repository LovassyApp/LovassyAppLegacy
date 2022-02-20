<?php

namespace App\Http\Controllers;

use App\Helpers\LibKreta\Grades\KretaGradeCategory;
use Illuminate\Http\Request;
use App\Helpers\LibLolo\LoloHelper;
use App\Helpers\LibSession\SessionManager;
use App\Helpers\ResponseMaker;

class GradeController extends Controller
{
    protected string $permissionScope = 'General';

    public function index(Request $request)
    {
        $this->checkPermission('grades');

        $refresh = (bool) $request->query('refresh', false);
        if ($refresh == true) {
            LoloHelper::updateGrades();
        }

        $allGrades = SessionManager::user()
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

<?php

namespace App\Http\Controllers;

use App\Helpers\LibKreta\Grades\KretaGradeCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Helpers\LibLolo\LoloHelper;
use App\Helpers\ResponseMaker;

class GradeController extends Controller
{
    public function index(Request $request)
    {
        $refresh = (bool) $request->query('refresh', false);
        if ($refresh == true) {
            LoloHelper::updateGrades();
        }

        $allGrades = Auth::user()
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

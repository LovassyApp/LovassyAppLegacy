<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QRCode;
use App\Helpers\ResponseMaker;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode as QRGen;
use Response;

class QRCodeController extends Controller
{
    protected string $permissionScope = 'QRCode';

    public function index()
    {
        $this->checkPermission('view');
        $codes = QRCode::all();

        return ResponseMaker::generate($codes);
    }

    public function create(Request $request)
    {
        $this->checkPermission('add');
        $data = $request->validate([
            'name' => ['required', 'max:255', 'string', 'unique:q_r_codes'],
            'email' => ['required', 'string', 'max:255', 'email'],
        ]);
        $code = new QRCode();

        $code->name = $data['name'];
        $code->secret = Str::random(20);
        $code->email = $data['email'];

        $code->save();

        return ResponseMaker::generate([], 200, 'Code generated successfully!');
    }

    public function show($image)
    {
        $code = QRCode::findOrFail($image);
        $payload = encrypt(
            (object) [
                'name' => $code->name,
                'secret' => $code->secret,
            ]
        );

        $image = QRGen::encoding('UTF-8')
            ->size(600)
            ->format('png')
            ->generate($payload);

        return Response::make($image, 200, [
            'Content-Type' => 'image/png',
            'Content-Disposition' => 'attachment',
        ]);
    }

    public function delete(Request $request)
    {
        $this->checkPermission('delete');
        $id = $request->validate([
            'id' => ['required', 'integer'],
        ])['id'];

        $code = QRCode::findOrFail($id);
        $code->delete();

        return ResponseMaker::generate([], 200, 'Code deleted successfully!');
    }
}

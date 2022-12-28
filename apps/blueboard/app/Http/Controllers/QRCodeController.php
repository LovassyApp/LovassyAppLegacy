<?php

namespace App\Http\Controllers;

use App\Permissions\QRCode\ViewQRCodes;
use App\Models\QRCode;
use App\Helpers\Shared\Utils\ResponseMaker;
use App\Http\Requests\QRCode\CreateQRCodeRequest;
use App\Http\Requests\QRCode\DeleteQRCodeRequest;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode as QRGen;
use Response;

class QRCodeController extends Controller
{
    public function index()
    {
        $this->warden_authorize(ViewQRCodes::use());
        $codes = QRCode::all();

        return ResponseMaker::generate($codes);
    }

    public function create(CreateQRCodeRequest $request)
    {
        $data = $request->safe();
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

    public function delete(DeleteQRCodeRequest $request)
    {
        $id = $request->safe()['id'];

        $code = QRCode::findOrFail($id);
        $code->delete();

        return ResponseMaker::generate([], 200, 'Code deleted successfully!');
    }
}

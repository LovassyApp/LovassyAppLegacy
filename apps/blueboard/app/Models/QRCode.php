<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use URL;

class QRCode extends Model
{
	use HasFactory;

	protected $appends = ['image'];

	public function getImageAttribute()
	{
		return URL::signedRoute('qrimage', [
			'image' => $this->id,
		]);
	}
}

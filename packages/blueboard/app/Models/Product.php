<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use URL;

class Product extends Model
{
	use HasFactory;

	protected $appends = ['imageUrl'];

	public function getImageUrlAttribute()
	{
		return URL::signedRoute('productimage', [
			'productID' => $this->id,
		]);
	}

	public function codes(): BelongsToMany
	{
		return $this->belongsToMany(QRCode::class, 'product_code', 'product_id', 'code_id');
	}

	protected $with = ['codes'];

	public static function allVisible(): Collection
	{
		return self::where('visible', 1)->get();
	}
}

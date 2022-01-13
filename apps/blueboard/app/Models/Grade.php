<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Grade extends Model
{
	use HasFactory;

	protected static function boot()
	{
		parent::boot();
		static::addGlobalScope('order', function (Builder $builder) {
			$builder->orderBy('date', 'asc');
		});
	}
}

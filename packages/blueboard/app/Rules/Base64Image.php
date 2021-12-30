<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
/*
    Base64 encoded image validation
    Kicsit sem akartam kitépni minden egyes szál hajamat...
        De ez legalább nem olyan ronda
*/
class Base64Image implements Rule
{
	// Valid MIME types
	private array|null $validMimes = null;

	// Size of file (in Megabytes)
	private float|null $maxSize = null;

	// Image mime type
	private string|null $mime = null;

	// Validation steps
	private bool $imagePassed = false;
	private bool $sizePassed = false;
	private bool $typePassed = false;

	// Type message
	private string|null $typeMessage = null;

	private mixed $value = null;

	/**
	 * Create a new rule instance.
	 *
	 * @return void
	 *
	 * @param int $size
	 * Expects maximum size in megabytes.
	 * Defaults to 5.
	 *
	 * @param array $mimes
	 * Expects an array of valid mime types.
	 * Defaults to png and jpeg.
	 *
	 * @param string $typeMessage
	 * Expects a string containing the message which is displayed when the MIME type is invalid.
	 * Defaults to: 'The image must be either a PNG or JPG.'
	 */
	public function __construct(
		float $size = 5,
		array $mimes = ['image/png', 'image/jpeg'],
		string $typeMessage = 'The image must be either a PNG or JPG.'
	) {
		$this->maxSize = $size;
		$this->validMimes = $mimes;
		$this->typeMessage = $typeMessage;
	}

	/**
	 * Determine if the uploaded image's size is allowed.
	 *
	 * @return void
	 */
	private function validateSize()
	{
		try {
			$decoded = base64_decode($this->value);
		} catch (\Exception $e) {
			$this->imagePassed = false;
			throw new \Exception('Invalid data supplied.');
		}

		// Byte -> Megabyte (Mebibyte)
		$size = strlen($decoded) / pow(1024, 2);

		if ($size < $this->maxSize) {
			$this->sizePassed = true;
		} else {
			$this->sizePassed = false;
			throw new \Exception('Invalid size data supplied.');
		}
	}

	/**
	 * Determine if supplied data is an image.
	 *
	 * @return void
	 */
	private function validateImage()
	{
		try {
			$imageSizeObj = getimagesize($this->value);
			$this->mime = $imageSizeObj['mime'];
			$this->imagePassed = true;
		} catch (\Exception $ex) {
			$this->imagePassed = false;
			throw new \Exception('Invalid data supplied.');
		}
	}

	/**
	 * Determine if supplied image's mime type is allowed.
	 *
	 * @return void
	 */
	private function validateMime()
	{
		if (!in_array($this->mime, $this->validMimes)) {
			$this->typePassed = false;
			throw new \Exception('Invalid mime type supplied.');
		} else {
			$this->typePassed = true;
		}
	}

	/**
	 * Determine if the validation rule passes.
	 *
	 * @param  string  $attribute
	 * @param  mixed  $value
	 * @return bool
	 */
	public function passes($attribute, $value)
	{
		$this->attribute = $attribute;
		$this->value = $value;

		try {
			$this->validateImage();
			$this->validateSize();
			$this->validateMime();
		} catch (\Exception $ex) {
			return false;
		}
		return true;
	}

	/**
	 * Get the validation error message.
	 *
	 * @return string
	 */
	public function message()
	{
		if (!$this->imagePassed) {
			return 'Invalid image supplied.';
		}
		if (!$this->sizePassed) {
			return "The size of the supplied image is invalid. The maximum size is $this->maxSize megabytes.";
		}
		if (!$this->typePassed) {
			return $this->typeMessage;
		}

		return 'General image validation error.';
	}
}

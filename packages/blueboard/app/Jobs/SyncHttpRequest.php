<?php

namespace App\Jobs;

use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Http;

class SyncHttpRequest
{
	use Dispatchable;
	private $url;
	private $headers;
	public $req;

	/**
	 * Create a new job instance.
	 *
	 * @return void
	 */
	public function __construct($url, $headers)
	{
		$this->url = $url;
		$this->headers = $headers;
	}

	/**
	 * Execute the job.
	 *
	 * @return void
	 */
	public function handle()
	{
		$req = Http::withUserAgent("PostmanRuntime/7.28.4")
			->withHeaders($this->headers)
			->get($this->url);
		$this->req = $req;
	}
}

<?php

namespace App\Helpers\LibSession;

use App\Exceptions\LibSession\SessionNotFoundException;
use Illuminate\Support\Facades\Redis;
use App\Helpers\LibSession\Session;

/**
 * Egy fos reidsz (trédmárk) kezelő
 * Csak egy két élet-egyszerűsítésre írt function
 */
class RedisManager
{
	/**
	 * @var string
	 */
	private string $hash;

	/**
	 * @var string
	 * Ez így miért
	 *  - Én a jövőből
	 */
	private string $prefix = 'Session-';

	/**
	 * @param string $hash
	 */
	public function __construct(string $hash)
	{
		$this->hash = $hash;
	}

	/**
	 * @return string
	 */
	private function getSessionIdentifier(): string
	{
		return $this->prefix . $this->hash;
	}

	/**
	 * @param \App\Helpers\LibSession\Session $session
	 * Redis bejegyzést hoz létre egy adott session-ből
	 */
	public function write(Session $session)
	{
		$data = $session->toJson();
		$id = $this->getSessionIdentifier();

		Redis::set($id, $data);
	}

	/**
	 * @return mixed
	 * @throws SessionNotFoundException
	 * Session visszatöltés, oszt ha nincs, akkó' exception
	 */
	public function read(): object
	{
		$id = $this->getSessionIdentifier();
		$read = Redis::get($id, null);
		if ($read == null) {
			throw new SessionNotFoundException();
		}
		$data = json_decode($read);
		return (object) $data;
	}

	/**
	 * @return mixed
	 * Az a nyomoronc session vajon létezik-e?
	 */
	public function exists(): bool
	{
		$id = $this->getSessionIdentifier();
		return Redis::exists($id);
	}

	/**
	 * Ha létezik az session, törölni aztat
	 */
	public function deleteIfExists()
	{
		if ($this->exists()) {
			Redis::del($this->getSessionIdentifier());
		}
	}

	/**
	 * Üres session
	 */
	public function init()
	{
		$id = $this->getSessionIdentifier();
		Redis::set($id, json_encode([]));
	}
}

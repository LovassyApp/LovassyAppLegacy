<?php

namespace App\Helpers\LibSession;

use App\Helpers\LibSession\RedisManager as LibSessionRedisManager;

/**
 * Session implementáció, nem valami nagy vászisztdász
 */
class Session
{
	/**
	 * @var object
	 */
	private object $data;
	/**
	 * @var RedisManager
	 */
	private LibSessionRedisManager $man;
	/**
	 * @var string
	 */
	private string $hash;

	/**
	 * @param $hash
	 */
	public function __construct($hash)
	{
		$this->data = (object) [];
		$this->man = new LibSessionRedisManager($hash);
		$this->hash = $hash;
		$this->tryResume();
	}

	/**
	 * @return bool
	 * @throws \App\Exceptions\LibSession\SessionNotFoundException
	 *
	 * Próbálkozik (hehe) a session-t visszatölteni, ha nem sikerül, (az szopó jami) akkor hiba
	 */
	private function tryResume(): void
	{
		$obj = $this->man->read();

		if (isset($obj->data)) {
			$this->data = $obj->data;
		}
	}

	/**
	 * @param $name
	 * @param $value
	 * Varázslaaaaaat.
	 */
	public function __set($name, $value)
	{
		$this->data->{$name} = $value;
		$this->man->write($this);
	}

	/**
	 * @param $name
	 * @return mixed
	 * Megint csak medzsik.
	 */
	public function __get($name)
	{
		return $this->data->{$name};
	}

	/**
	 * @return false|string
	 * Session JSON-ban rediszbe
	 * Egy-két plusz infóval
	 */
	public function toJson()
	{
		return json_encode([
			'lastWritten' => time(),
			'hash' => $this->hash,
			'data' => $this->data,
		]);
	}

	/**
	 * @return object
	 * Összes adat ami a sessionben van
	 */
	public function all(): object
	{
		return $this->data;
	}

	/**
	 * @param $name
	 * Harmadik Varázslatos remekséges izé
	 */
	public function __unset($name)
	{
		unset($this->data->{$name});
		$this->man->write($this);
	}

	/**
	 * @param string $hash
	 * @return Session
	 * Új üres session
	 */
	public static function start(string $hash): Session
	{
		$man = new LibSessionRedisManager($hash);
		$man->init();

		return new self($hash);
	}
}

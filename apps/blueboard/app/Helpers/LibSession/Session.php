<?php

namespace App\Helpers\LibSession;

use App\Exceptions\LibSession\SessionNotFoundException;
use App\Helpers\LibSession\RedisManager as LibSessionRedisManager;

/**
 * Session implementáció, nem valami nagy vászisztdász
 * insert vicces comment here
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
     * @throws SessionNotFoundException
     */
    public function __construct($hash)
    {
        $this->data = (object) [];
        $this->man = new LibSessionRedisManager($hash);
        $this->hash = $hash;
        $this->tryResume();
    }

    /**
     * @throws SessionNotFoundException
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
     * @param string $hash
     * @return Session
     * Új üres session
     * @throws SessionNotFoundException
     */
    public static function start(string $hash): Session
    {
        $man = new LibSessionRedisManager($hash);
        $man->init();

        return new self($hash);
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
     * @return string
     * Session JSON-ban rediszbe
     * Egy-két plusz infóval
     */
    public function toJson(): string
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
}

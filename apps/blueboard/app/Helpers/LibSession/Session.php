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
     * Próbálkozik (hehe) a session-t visszatölteni, ha nem sikerül, (az szopó jami) akkor hiba
     *
     * @throws SessionNotFoundException
     */
    private function tryResume(): void
    {
        $obj = $this->man->read();

        if (isset($obj->data)) {
            $this->data = $obj->data;
        }
    }

    /**
     * Új üres session
     *
     * @param string $hash
     * @return Session
     * @throws SessionNotFoundException
     */
    public static function start(string $hash): Session
    {
        $man = new LibSessionRedisManager($hash);
        $man->init();

        return new self($hash);
    }

    /**
     * Megint csak medzsik.
     *
     * @param $name
     * @return mixed
     */
    public function __get($name)
    {
        return $this->data->{$name};
    }

    /**
     * Varázslaaaaaat.
     *
     * @param $name
     * @param $value
     */
    public function __set($name, $value)
    {
        $this->data->{$name} = $value;
        $this->man->write($this);
    }

    /**
     * Session JSON-ban rediszbe
     * Egy-két plusz infóval
     *
     * @return string
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
     * Összes adat ami a sessionben van
     *
     * @return object
     */
    public function all(): object
    {
        return $this->data;
    }

    /**
     * Harmadik Varázslatos remekséges izé
     *
     * @param $name
     */
    public function __unset($name)
    {
        unset($this->data->{$name});
        $this->man->write($this);
    }
}

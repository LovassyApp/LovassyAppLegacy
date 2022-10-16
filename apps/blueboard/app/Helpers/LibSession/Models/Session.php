<?php

namespace App\Helpers\LibSession\Models;

use App\Helpers\LibSession\Errors\SessionNotFoundException;
use App\Helpers\LibSession\Interfaces\SessionInterface;
use App\Helpers\LibSession\Helpers\RedisManager as LibSessionRedisManager;

/**
 * Session implementáció, nem valami nagy vászisztdász
 * insert vicces comment here
 */
class Session implements SessionInterface
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

    public readonly string $salt;
    public readonly int $expiry;
    public readonly string $user_salt;
    private int $last_written = 0;

    /**
     * Próbálkozik (hehe) a session-t visszatölteni, ha nem sikerül, (az szopó jami) akkor hiba
     *
     * @param $hash
     * @throws SessionNotFoundException
     */
    public function __construct(string $hash)
    {
        $this->data = (object) [];
        $this->man = new LibSessionRedisManager($hash);
        $this->hash = $hash;

        $obj = $this->man->read();
        if (isset($obj->data)) {
            $this->data = $obj->data;
        }
        $this->expiry = $obj->expiry;
        $this->salt = $obj->salt;
        $this->user_salt = $obj->user_salt;
    }

    /**
     * Új üres session
     *
     * @param string $hash
     * @return Session
     * @throws SessionNotFoundException
     */
    public static function start(string $hash, int $expiry, string $salt, string $user_salt): self
    {
        $man = new LibSessionRedisManager($hash);
        $man->init();

        $man->writeRaw(
            (object) [
                'lastWritten' => time(),
                'hash' => $hash,
                'expiry' => $expiry,
                'salt' => $salt,
                'user_salt' => $user_salt,
            ]
        );

        return new self($hash);
    }

    /**
     * Megint csak medzsik.
     *
     * @param $name
     * @return mixed
     */
    public function __get(string $name): mixed
    {
        return $this->data->{$name} ?? null;
    }

    /**
     * Varázslaaaaaat.
     *
     * @param $name
     * @param $value
     */
    public function __set(string $name, mixed $value): void
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
            'last_written' => time(),
            'hash' => $this->hash,
            'data' => $this->data,
            'expiry' => $this->expiry,
            'salt' => $this->salt,
            'user_salt' => $this->user_salt,
        ]);
    }

    /**
     * Összes adat ami a sessionben van
     *
     * @return object
     */
    public function all(bool $getProps = true): object
    {
        if ($getProps) {
            return (object) array_merge((array) $this->data, [
                'salt' => $this->salt,
                'user_salt' => $this->user_salt,
                'expiry' => $this->expiry,
            ]);
        }
        return $this->data;
    }

    /**
     * Harmadik Varázslatos remekséges izé
     *
     * @param $name
     */
    public function __unset(string $name): void
    {
        unset($this->data->{$name});
        $this->man->write($this);
    }

    public function lastWritten(): int
    {
        return $this->last_written;
    }
}

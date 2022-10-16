<?php

namespace App\Helpers\LibSession\Helpers;

use App\Helpers\LibSession\Errors\SessionNotFoundException;
use App\Helpers\LibSession\Models\Session;
use Illuminate\Support\Facades\Redis;

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
    private static string $prefix = 'Session-';

    /**
     * @param string $hash
     */
    public function __construct(string $hash)
    {
        $this->hash = $hash;
    }

    /**
     * Redis bejegyzést hoz létre egy adott session-ből
     *
     * @param Session $session
     */
    public function write(Session $session): void
    {
        $data = $session->toJson();
        $id = $this->getSessionIdentifier();

        Redis::set($id, $data);
    }

    /**
     * Redis bejegyzést hoz létre egy adott objektumból
     *
     * @param object $data
     */
    public function writeRaw(object $data): void
    {
        $id = $this->getSessionIdentifier();
        Redis::set($id, json_encode($data));
    }

    /**
     * @return string
     */
    private function getSessionIdentifier(): string
    {
        return self::$prefix . $this->hash;
    }

    /**
     * Session visszatöltés, oszt ha nincs, akkó' exception
     *
     * @return mixed
     * @throws SessionNotFoundException
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
     * Ha létezik az session, törölni aztat
     */
    public function deleteIfExists(): void
    {
        if ($this->exists()) {
            Redis::del($this->getSessionIdentifier());
        }
    }

    /**
     * Az a nyomoronc session vajon létezik-e?
     *
     * @return mixed
     */
    public function exists(): bool
    {
        $id = $this->getSessionIdentifier();
        return Redis::exists($id);
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

<?php

namespace App\Helpers\LibKreta;

use App\Exceptions\ExceptionRenderer;
use App\Exceptions\LibKreta\KretaCredentialException;
use App\Exceptions\LibKreta\KretaGeneralException;
use App\Exceptions\LibKreta\KretaTokenException;
use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use JetBrains\PhpStorm\Pure;

/**
 * BaseClass a LibKréta nevű csodához.
 * Minden KRÉTA API hívásokhoz szükséges függvényt tartalmaz
 */
class BaseKreta
{
    /**
     * @var string
     * OAuth Client ID
     */
    protected string $clientID = 'kreta-ellenorzo-mobile';
    /**
     * @var array|string[]
     * Egy csomó random Androidos telefon kódneve
     */
    protected array $codeNames = [
        'a3xelte',
        'a5xelte',
        'a5y17lte',
        'A6020',
        'a7y17lte',
        'addison',
        'albus',
        'Amber',
        'angler',
        'armani',
        'athene',
        'axon7',
        'bacon',
        'bardock',
        'bardockpro',
        'berkeley',
        'beryllium',
        'bullhead',
        'cancro',
        'capricorn',
        'chagalllte',
        'chagallwifi',
        'chaozu',
        'charlotte',
        'che10',
        'cheeseburger',
        'cherry',
        'cheryl',
        'chiron',
        'clark',
    ];

    /**
     * @var Endpoints
     * Kréta végpontok listája
     */
    protected Endpoints $endpoints;

    /**
     * @var int
     * Timeout másodpercben
     */
    private int $timeout = 10;

    /**
     *
     */
    #[Pure]
    protected function __construct()
    {
        $this->endpoints = new Endpoints();
    }

    /**
     * @param $token
     * @return object
     * JWT dekóder
     */
    protected function decodeToken($token): object
    {
        $tokenArray = explode('.', $token);
        return (object) [
            'header' => json_decode(base64_decode($tokenArray[0])),
            'attributes' => json_decode(base64_decode($tokenArray[1])),
            'signature' => $tokenArray[2],
        ];
    }

    /**
     * @throws Exception
     * Ezt egyszer újra kellene írni, elég régi
     * De még jó
     * Hangsúly: MÉG
     */
    protected function url($instituteCode = null, $urlType = null, $path = ''): string
    {
        switch ($urlType) {
            case 'api':
                return "https://$instituteCode.e-kreta.hu$path";
            case 'auth':
                return "https://idp.e-kreta.hu/$path";
            case 'institutes':
                return "https://kretaglobalmobileapi.ekreta.hu/api/v1/Institute/$path";
            default:
                throw new Exception('No urlType specified');
                break;
        }
    }

    /**
     * GET Request, minden header nélkül (nonce-hoz)
     *
     * @throws KretaGeneralException
     */
    protected function getNonceReq(string $url): string
    {
        try {
            return Http::withUserAgent($this->getUserAgent())
                ->timeout($this->timeout)
                ->get($url)
                ->body();
        } catch (ConnectionException $e) {
            throw new KretaGeneralException($e->getMessage(), 'KRETA connection error. Likely maintenance mode.');
        }
    }

    /**
     * Egy random Android verzió / user agent páros
     *
     * @return string
     */
    protected function getUserAgent(): string
    {
        $base = config('kreta.user_agent');
        $codename = $this->codeNames[array_rand($this->codeNames)];
        $rand = [rand(5, 10), rand(0, 2)];
        $verNum = "$rand[0].$rand[1]";
        return "$base (Android; $codename $verNum)";
    }

    /**
     * Csak egy sima post request (auhentikációhoz)
     *
     * @throws KretaGeneralException
     */
    protected function makePostRequest(string $url, array $form, array $headers = []): Response
    {
        try {
            return Http::withUserAgent($this->getUserAgent())
                ->withHeaders($headers)
                ->asForm()
                ->timeout($this->timeout)
                ->post($url, $form);
        } catch (ConnectionException $e) {
            throw new KretaGeneralException($e->getMessage(), 'KRETA connection error. Likely maintenance mode.');
        }
    }

    /**
     * GET Request, tokennel mindennel (is) + egy kis hibakezelés
     *
     * @throws KretaCredentialException
     * @throws KretaGeneralException
     * @throws ExceptionRenderer
     * @throws KretaTokenException
     */
    protected function makeGetRequest(string $url, array $headers = [], bool $auth = false, bool $retry = false): string
    {
        if ($auth) {
            $token = KretaTokenHelper::getCurrentToken();
            $authHeader = ['Authorization' => "Bearer $token"];
            $reqHeaders = array_merge($authHeader, $headers);

            try {
                return $this->getRequest($url, $reqHeaders);
            } catch (KretaCredentialException $e) {
                KretaTokenHelper::renewToken();
                if ($retry) {
                    throw new KretaGeneralException($e->getMessage());
                }
                return $this->makeGetRequest($url, $headers, $auth, true);
            } catch (ConnectionException $e) {
                throw new KretaGeneralException($e->getMessage(), 'KRETA connection error. Likely maintenance mode.');
            } catch (Exception $e) {
                throw new ExceptionRenderer($e);
            }
        } else {
            return $this->getRequest($url, $headers);
        }
    }

    /**
     * Váááá automata token megújítáááás.
     * Meg krétás hibakezelés izé (ha tudnám, hogy ezt miért is így csináltam anno...)
     *
     * @throws KretaCredentialException
     */
    private function getRequest(string $url, array $headers = []): string
    {
        /*$job = new SyncHttpRequest($url, $headers);
         dispatch($job);*/
        $req = Http::withUserAgent($this->getUserAgent())
            ->withHeaders($headers)
            ->timeout($this->timeout)
            ->get($url);
        $body = $req->body();

        if ($body == 'invalid_grant') {
            throw new KretaCredentialException($req->body());
        }

        return $body;
    }
}

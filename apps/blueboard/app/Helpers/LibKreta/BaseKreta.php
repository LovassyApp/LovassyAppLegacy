<?php

namespace App\Helpers\LibKreta;

use App\Exceptions\APIException;
use App\Exceptions\ExceptionRenderer;
use App\Exceptions\LibKreta\KretaCredentialException;
use App\Exceptions\LibKreta\KretaGeneralException;
use App\Helpers\LibKreta\KretaTokenHelper;
use Illuminate\Http\Client\ConnectionException;
//use App\Jobs\SyncHttpRequest;
use Illuminate\Support\Facades\Http;

class BaseKreta
{
    protected string $apiKey = '7856d350-1fda-45f5-822d-e1a2f3f1acf0';
    protected string $clientID = 'kreta-ellenorzo-mobile';
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

    protected string $userAgent = 'com.llg.app';

    protected Endpoints $endpoints;

    private int $timeout = 10;

    protected function __construct()
    {
        $this->endpoints = new Endpoints();
    }

    protected function getUserAgent()
    {
        $codename = $this->codeNames[array_rand($this->codeNames)];
        $rand = [rand(5, 10), rand(0, 2)];
        $verNum = "$rand[0].$rand[1]";
        $userAgent = "$this->userAgent (Android; $codename $verNum)";
        return $userAgent;
    }

    protected function decodeToken($token)
    {
        $tokenArray = explode('.', $token);
        $token = (object) [
            'header' => json_decode(base64_decode($tokenArray[0])),
            'attributes' => json_decode(base64_decode($tokenArray[1])),
            'signature' => $tokenArray[2],
        ];
        return $token;
    }

    protected function url($instituteCode = null, $urlType = null, $path = '')
    {
        // BTW: Egy érdekes KRÉTA bug:
        // ha az URL bárhol tartalmazza a // karaktereket, akkor behal az API
        // Jó tudni
        // Madzsar szoftver
        switch ($urlType) {
            case 'api':
                return "https://$instituteCode.e-kreta.hu$path";
            case 'auth':
                return "https://idp.e-kreta.hu/$path";
            case 'institutes':
                return "https://kretaglobalmobileapi.ekreta.hu/api/v1/Institute/$path";
            default:
                throw new \Exception('No urlType specified');
                break;
        }
    }

    protected function getNonceReq(string $url)
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

    private function getRequest(string $url, array $headers = [])
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

    protected function makePostRequest(string $url, array $form, array $headers = [])
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

    // Váááá automata token megújítáááás
    // Meg krétás hibakezelés izé

    protected function makeGetRequest(string $url, array $headers = [], bool $auth = false, bool $retry = false)
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
            } catch (\Exception $e) {
                throw new ExceptionRenderer($e);
            }
        } else {
            return $this->getRequest($url, $headers);
        }
    }
}

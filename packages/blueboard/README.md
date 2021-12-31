# Blueboard

> Tessék felkészülni: Káromkodás filter nincs, nem volt és nem is lesz...

Szóval ömm ja... A Blueboard igazából egy elcseszett JSON-os REST API, Laravel 8 alapokon. A LovassyAPP által használt API server.

## Érdekességek

-   Egy-két _érdekes_ komment

-   Az egész szerver _Laravel 8_ alatt fut, _PHP 8_, vagy _7.4_ kell hozzá

-   Az adatbázis(ok) _Redis **és** Mysql_, mindkettő szükséges (Redis: Eventek, + SessionManager)

-   WebSocket-ek Pusher kompatibilis szerverrel működnek, nálunk ez _soketi_

-   A beépített KRÉTA kliens (_LibKreta_) csak egy institute ID-val lett tesztelve, és k@rva hiányos... hát ömm izé... ne várjatok tőle sokat.

## License

[MIT](https://choosealicense.com/licenses/mit/)

> Igazából ki vagyok én, hogy ezt betartassam? lol
>
> BTW: Az egész név egy fos vicc: Krétát kezelünk, tehát kötelező a tanszerrel kapcsolatos név. 'Tábla napló' (geez miafasz) még nincs, ezért Board, a Blue pedig hát... A lovassy színe a kék, én meg basic vagyok... Szóval ja... Blueboard. (Jobb, mint a Kék tábla napló vagy idk)

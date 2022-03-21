# LovassyApp

Mobil app, weboldal és API a Loló rendszerhez és a Kréta e-napló egyes funkcióihoz.

## Fejelsztői környezet felállítása

A fejlesztői környezethez szükség van [Docker](https://www.docker.com/)-re, [Node.js](https://nodejs.org/en/)-re, [Yarn](https://yarnpkg.com/)-ra és [Git](https://git-scm.com/)-re. Ezek telepítési útmutatóját a megadott linkeken lehet megtalálni. Ezeken kívül mi [VS Code](https://code.visualstudio.com/)-ot használunk kódszerkesztőként, de bermilyen más kódszerkesztő is megfelelő (VS Code-hoz található konfiguráció a llgapp.code-workspace nevű fájlban).

1. lépés: Project klónozása a kívánt mappába.

```
git clone https://github.com/LovassyApp/LovassyApp.git
```

2. lépés: A dependency-k letöltése

```
yarn
lerna bootstap
```

3. lépés: Konfigurációs fájlok kitöltése (A `.env` fájlok létrehozása azokban a mappákban, ahol van `.env.example` és kitöltése a `.env.example` fájl alapján. Ilyen fájlokra az `apps/` mappában lévő almappákban van szükség)

4. lépés: A Docker környezet felállítása (A Docker elindítása ez előtt szükséges. Ha valamikor problémák lépnek fel ezzel a jövőben a megoldás általában `yarn docker-down` és utána `yarn docker-start`) és a [Docker Compose V2](https://docs.docker.com/compose/cli-command/) bekapcsolása.
```
yarn docker-build
yarn docker-start
```

## Futtatás a fejlesztői környezetben

Minden alkalommal el kell indítani a Docker-t futtatás előtt. Ehhez a parancs: `yarn docker-start`

Az `apps/` mappában lévő egyik almappába navigálással lehet futtatni az adott projektet a `yarn start` parancsal (boardlight-rewrite esetében `yarn dev`, a blueboard mindig fut Docker-ben ezért külön nem kell elindítani).

Az `apps/` mappában található projektek:
 - blueboard: A szerveren futó alkalmazás, [Laravel](https://laravel.com/) keretrendszert használ
 - boardlight: A webes LovassyApp alkalmazás, [React](https://hu.reactjs.org/) keretrendszert használ
 - boardlight-rewrite: A boardlight újraírás kezdeményszerűsége, [React](https://hu.reactjs.org/) keretrendszert használ
 - boardlight-mobile: A mobilos LovassyApp alkalmazás. [React Native (Expo)](https://expo.dev/) keretrendszert használ
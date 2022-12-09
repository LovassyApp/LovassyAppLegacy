// / <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BLUEBOARD_URL: string;
    readonly VITE_BLUEBOARD_SOKETI_HOST: string;
    readonly VITE_BLUEBOARD_SOKETI_KEY: string;
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

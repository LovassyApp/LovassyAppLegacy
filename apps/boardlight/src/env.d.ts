// / <reference types="vite/client" />

declare module '*.module.css' {
    const content: Record<string, string>;
    export default content;
}

declare module '*.jpg' {
    const url: string;
    export default url;
}

interface ImportMetaEnv {
    readonly VITE_BLUEBOARD_URL: string;
    readonly VITE_BLUEBOARD_SOKETI_HOST: string;
    readonly VITE_BLUEBOARD_SOKETI_KEY: string;
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

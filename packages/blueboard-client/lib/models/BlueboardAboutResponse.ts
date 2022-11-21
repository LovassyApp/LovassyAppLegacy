export default class BlueboardAboutResponse {
    constructor(
        public readonly whoami: string,
        public readonly php_version: string,
        public readonly laravel_version: string,
        public readonly blueboard_version: string,
        public readonly contributors: string[],
        public readonly repository: string,
        public readonly motd: string
    ) {}
}

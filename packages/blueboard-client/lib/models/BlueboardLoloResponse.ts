import BlueboardLoloCoin from "./BlueboardLoloCoin";

class BlueboardLoloResponse {
    constructor(
        public readonly balance: number,
        public readonly coins: Array<BlueboardLoloCoin>
    ) {}
}

export default BlueboardLoloResponse;

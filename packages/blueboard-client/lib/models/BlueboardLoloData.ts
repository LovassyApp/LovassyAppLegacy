import BlueboardLoloCoin from "./BlueboardLoloCoin";

class BlueboardLoloData {
  constructor(
    public readonly balance: number,
    public readonly coins: Array<BlueboardLoloCoin>
  ) {}
}

export default BlueboardLoloData;

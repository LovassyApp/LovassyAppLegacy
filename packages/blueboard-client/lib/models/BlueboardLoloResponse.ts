import BlueboardLoloData from "./BlueboardLoloData";

class BlueboardLoloResponse {
  constructor(
    public readonly status: string,
    public readonly message: string,
    public readonly data: BlueboardLoloData
  ) {}
}

export default BlueboardLoloResponse;

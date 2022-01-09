import BlueboardKretaGradeData from "./BlueboardKretaGradeData";

class BlueboardKretaGradeResponse {
  constructor(
    public readonly status: string,
    public readonly message: string,
    public readonly data: Array<BlueboardKretaGradeData>
  ) {}
}

export default BlueboardKretaGradeResponse;

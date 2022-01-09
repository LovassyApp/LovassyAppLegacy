import BlueboardKretaGrade from "./BlueboardKretaGrade";

class BlueboardKretaGradeData {
  constructor(
    public readonly subject: string,
    public readonly grades: Array<BlueboardKretaGrade>
  ) {}
}

export default BlueboardKretaGradeData;

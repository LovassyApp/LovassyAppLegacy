import BlueboardTimestamps from "./BlueboardTimestamps";

class BlueboardKretaGrade {
    constructor(
        public readonly id: number,
        public readonly timestamps: BlueboardTimestamps,
        public readonly userId: number,
        public readonly loloId: number,

        public readonly uid: string,
        public readonly date: string,
        public readonly subject: string,
        public readonly teacher: string,
        public readonly name: string,
        public readonly type: string,
        public readonly gradeType: string,
        public readonly gradeText: string,

        public readonly grade: number,
        public readonly weight: number
    ) {}
}

export default BlueboardKretaGrade;

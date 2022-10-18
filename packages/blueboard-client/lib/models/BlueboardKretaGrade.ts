import BlueboardTimestamps from './BlueboardTimestamps';
import BluboardKretaEvaluationType from './BlueboardKretaEvaluationType';

class BlueboardKretaGrade {
    constructor(
        public readonly id: number,
        public readonly timestamps: BlueboardTimestamps,
        public readonly userId: number,
        public readonly loloId: number,

        // AU.
        public readonly uid: string,
        public readonly subject: string,
        public readonly subjectCategory: string,
        public readonly teacher: string,
        public readonly group: string,
        public readonly name: string,
        public readonly grade: number,
        public readonly textGrade: string,
        public readonly shortTextGrade: string,
        public readonly weight: number,
        public readonly date: string,
        public readonly type: string,
        public readonly gradeType: string,
        public readonly evaluationType: BluboardKretaEvaluationType,
        public readonly evaluationTypeDescription: string
    ) {}
}

export default BlueboardKretaGrade;

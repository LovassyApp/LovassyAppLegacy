import BlueboardKretaGrade from "../models/BlueboardKretaGrade";
import BlueboardKretaGradeData from "../models/BlueboardKretaGradeData";
import BlueboardTimestamps from "../models/BlueboardTimestamps";
import { checkIterable } from "../BlueboardClientUtils";

class BlueboardKretaGradeDataFactory {
    static getResponse(obj: any) {
        const data: Array<BlueboardKretaGradeData> = [];

        if (checkIterable(obj)) {
            for (const gradeData of obj) {
                const subject = gradeData.subject;
                const grades: Array<BlueboardKretaGrade> = [];

                for (const grade of gradeData.grades) {
                    grades.push(
                        new BlueboardKretaGrade(
                            grade.id,
                            new BlueboardTimestamps(
                                grade.created_at,
                                grade.updated_at
                            ),
                            grade.user_id,
                            grade.lolo_id,
                            grade.uid,
                            grade.bounds,
                            grade.subject,
                            grade.teacher,
                            grade.name,
                            grade.grade,
                            grade.textGrade,
                            grade.shortTextGrade,
                            grade.weight,
                            grade.date,
                            grade.type,
                            grade.gradeType,
                            grade.evaluationType,
                            grade.evaluationTypeDescription
                        )
                    );
                }

                data.push(new BlueboardKretaGradeData(subject, grades));
            }
        }

        return data;
    }
}

export default BlueboardKretaGradeDataFactory;

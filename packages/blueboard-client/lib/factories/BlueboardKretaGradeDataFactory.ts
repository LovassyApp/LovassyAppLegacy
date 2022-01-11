import BlueboardKretaGrade from "../models/BlueboardKretaGrade";
import BlueboardKretaGradeData from "../models/BlueboardKretaGradeData";
import BlueboardTimestamps from "../models/BlueboardTimestamps";

class BlueboardKretaGradeDataFactory {
    static getResponse(obj: any) {
        const data: Array<BlueboardKretaGradeData> = [];

        for (const gradeData of obj.data) {
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
                        grade.date,
                        grade.subject,
                        grade.teacher,
                        grade.name,
                        grade.type,
                        grade.gradeType,
                        grade.gradeText,
                        grade.grade,
                        grade.weight
                    )
                );
            }

            data.push(new BlueboardKretaGradeData(subject, grades));
        }

        return data;
    }
}

export default BlueboardKretaGradeDataFactory;

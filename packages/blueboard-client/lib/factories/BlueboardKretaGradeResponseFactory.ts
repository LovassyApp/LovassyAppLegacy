import BlueboardKretaGrade from '../models/BlueboardKretaGrade';
import BlueboardKretaGradeData from '../models/BlueboardKretaGradeData';
import BlueboardTimestamps from '../models/BlueboardTimestamps';
import BlueboardKretaGradeResponse from '../models/BlueboardKretaGradeResponse';

class BlueboardKretaGradeResponseFactory {
    static getResponse(obj: any) {
        const status = obj.status;
        const message = obj.message;

        var data: Array<BlueboardKretaGradeData> = [];

        for (var gradeData of obj.data) {
            const subject = gradeData.subject;
            var grades: Array<BlueboardKretaGrade> = [];

            for (var grade of gradeData.grades) {
                grades.push(
                    new BlueboardKretaGrade(
                        grade.id,
                        new BlueboardTimestamps(grade.created_at, grade.updated_at),
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

        return new BlueboardKretaGradeResponse(status, message, data);
    }
}

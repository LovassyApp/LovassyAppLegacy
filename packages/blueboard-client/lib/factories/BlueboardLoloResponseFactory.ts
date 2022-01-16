import BlueboardKretaGrade from '../models/BlueboardKretaGrade';
import BlueboardLoloCoin from '../models/BlueboardLoloCoin';
import BlueboardLoloResponse from '../models/BlueboardLoloResponse';
import BlueboardLoloReason from '../models/BlueboardLoloReason';
import BlueboardTimestamps from '../models/BlueboardTimestamps';

class BlueboardLoloResponseFactory {
    static getResponse(obj: any) {
        const balance = obj.balance;
        const coins: Array<BlueboardLoloCoin> = [];

        for (const coin of obj.coins) {
            const id = coin.id;
            const timestamps = new BlueboardTimestamps(coin.created_at, coin.updated_at);
            const userId = coin.user_id;
            const historyId = coin.history_id;
            const isSpent = Boolean(coin.isSpent);
            let reason: BlueboardLoloReason;

            switch (coin.reason.message) {
                case 'Ötösökből automatikusan generálva.':
                    reason = BlueboardLoloReason.FromFive;
                    break;
                case 'Négyesekből automatikusan generálva.':
                    reason = BlueboardLoloReason.FromFour;
                    break;
                default:
                    reason = BlueboardLoloReason.FromRequest;
                    break;
            }

            const grades: Array<BlueboardKretaGrade> = [];

            for (const grade of coin.grades) {
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

            coins.push(new BlueboardLoloCoin(id, timestamps, userId, historyId, isSpent, reason, grades));
        }

        return new BlueboardLoloResponse(balance, coins);
    }
}

export default BlueboardLoloResponseFactory;

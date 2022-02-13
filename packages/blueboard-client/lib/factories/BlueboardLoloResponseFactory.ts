import BlueboardKretaGrade from "../models/BlueboardKretaGrade";
import BlueboardLoloCoin from "../models/BlueboardLoloCoin";
import BlueboardLoloReason from "../models/BlueboardLoloReason";
import BlueboardLoloResponse from "../models/BlueboardLoloResponse";
import BlueboardTimestamps from "../models/BlueboardTimestamps";

class BlueboardLoloResponseFactory {
    static getResponse(obj: any) {
        const balance = obj.balance;
        const coins = this.getCoins(obj.coins);

        return new BlueboardLoloResponse(balance, coins);
    }

    static getCoins(obj: any): Array<BlueboardLoloCoin> {
        const coins: Array<BlueboardLoloCoin> = [];

        for (const coin of obj) {
            const id = coin.id;
            const timestamps = new BlueboardTimestamps(
                coin.created_at,
                coin.updated_at
            );
            const userId = coin.user_id;
            const historyId = coin.history_id;
            const isSpent = Boolean(coin.isSpent);
            let reason: BlueboardLoloReason;
            const reasonText = coin.reason.message;

            switch (coin.reason.message) {
                case "Ötösökből automatikusan generálva.":
                    reason = BlueboardLoloReason.FromFive;
                    break;
                case "Négyesekből automatikusan generálva.":
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

            coins.push(
                new BlueboardLoloCoin(
                    id,
                    timestamps,
                    userId,
                    historyId,
                    isSpent,
                    reason,
                    grades,
                    reasonText
                )
            );
        }

        return coins;
    }
}

export default BlueboardLoloResponseFactory;

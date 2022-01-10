import BlueboardLoloCoin from '../models/BlueboardLoloCoin';
import BlueboardLoloData from '../models/BlueboardLoloData';
import BlueboardLoloReason from '../models/BlueboardLoloReason';
import BlueboardTimestamps from '../models/BlueboardTimestamps';

class BlueboardLoloResponseFactory {
    static getResponse(obj: any) {
        const status = obj.status;
        const message = obj.message;

        var data: BlueboardLoloData;

        const balance = obj.data.balance;
        var coins: Array<BlueboardLoloCoin> = [];

        for (var coin of obj.data.coins) {
            const id = coin.id;
            const timestamps = new BlueboardTimestamps(coin.created_at, coin.updated_at);
            const userId = coin.user_id;
            const historyId = coin.history_id;
            const isSpent = Boolean(coin.isSpent);
            var reason: BlueboardLoloReason;

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

            //TODO: Finish this
        }
    }
}

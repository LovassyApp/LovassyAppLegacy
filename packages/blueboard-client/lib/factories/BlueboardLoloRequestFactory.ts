import { BlueboardUserFactory } from '.';
import { BlueboardLoloRequest, BlueboardTimestamps } from '../models';

class BlueboardLoloRequestFactory {
    static getItem(obj: any) {
        const user = obj.user !== undefined ? BlueboardUserFactory.getUser(obj.user) : undefined;

        return new BlueboardLoloRequest(
            obj.id,
            obj.title,
            obj.body,
            new BlueboardTimestamps(obj.created_at, obj.updated_at),
            obj.accepted_at,
            obj.denied_at,
            user
        );
    }

    static getResponse(arr: Array<any>) {
        let items: Array<BlueboardLoloRequest> = [];

        arr.forEach((element) => {
            const item = this.getItem(element);
            items.push(item);
        });

        return items;
    }
}

export default BlueboardLoloRequestFactory;

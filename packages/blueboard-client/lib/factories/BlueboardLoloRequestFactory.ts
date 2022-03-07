import { BlueboardLoloRequest, BlueboardTimestamps } from '../models';

import { BlueboardUserFactory } from '.';
import { checkIterable } from '../BlueboardClientUtils';

class BlueboardLoloRequestFactory {
    static getItem(obj: any) {
        const user = obj.user
            ? BlueboardUserFactory.getUser(obj.user)
            : undefined;

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

    static getResponse(obj: any) {
        let items: Array<BlueboardLoloRequest> = [];

        if (checkIterable(obj)) {
            for (const element of obj) {
                items.push(this.getItem(element));
            }
        }

        return items;
    }
}

export default BlueboardLoloRequestFactory;

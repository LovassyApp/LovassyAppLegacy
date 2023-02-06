import BlueboardUser from '../models/BlueboardUser';
import BlueboardTimestamps from '../models/BlueboardTimestamps';
import { checkIterable } from '../BlueboardClientUtils';

class BlueboardUserFactory {
    static getUser(obj: any) {
        console.log(obj);
        return new BlueboardUser(
            obj.id,
            obj.name,
            obj.email,
            obj.groups,
            new BlueboardTimestamps(obj.created_at, obj.updated_at),
            obj.balance,
            obj.class,
            obj.real_name
        );
    }

    static getResponse(obj: any) {
        const data: Array<BlueboardUser> = [];

        if (checkIterable(obj)) {
            for (const product of obj) {
                data.push(BlueboardUserFactory.getUser(product));
            }
        } else {
            data.push(BlueboardUserFactory.getUser(obj));
        }

        return data;
    }
}

export default BlueboardUserFactory;

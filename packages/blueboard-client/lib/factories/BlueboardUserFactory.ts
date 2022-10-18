import BlueboardUser from '../models/BlueboardUser';
import BlueboardTimestamps from '../models/BlueboardTimestamps';

class BlueboardUserFactory {
    static getUser(obj: any) {
        return new BlueboardUser(
            obj.id,
            obj.name,
            obj.email,
            obj.groups,
            new BlueboardTimestamps(obj.created_at, obj.updated_at),
            obj.balance,
            obj.class
        );
    }
}

export default BlueboardUserFactory;

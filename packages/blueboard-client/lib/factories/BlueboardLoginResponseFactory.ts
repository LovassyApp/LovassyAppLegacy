import BlueboardLoginResponse from '../models/BlueboardLoginResponse';
import BlueboardUserFactory from './BlueboardUserFactory';

class BlueboardLoginResponseFactory {
    static getResponse(obj: any) {
        return new BlueboardLoginResponse(
            obj.result,
            obj.message,
            obj.status,
            BlueboardUserFactory.getUser(obj.user),
            obj.token,
            obj.remember_token
        );
    }
}

export default BlueboardLoginResponseFactory;

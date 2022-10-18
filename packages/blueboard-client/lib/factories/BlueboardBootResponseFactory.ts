import BlueboardBootResponse from '../models/BlueboardBootResponse';
import BlueboardInventoryFactory from './BlueboardInventoryFactory';
import BlueboardKretaGradeDataFactory from './BlueboardKretaGradeDataFactory';
import BlueboardLoginResponse from '../models/BlueboardLoginResponse';
import BlueboardLoloRequestFactory from './BlueboardLoloRequestFactory';
import BlueboardLoloResponseFactory from './BlueboardLoloResponseFactory';
import BlueboardProductFactory from './BlueboardProductFactory';
import BlueboardUserFactory from './BlueboardUserFactory';

class BlueboardBootResponseFactory {
    static getResponse(obj: any) {
        return new BlueboardBootResponse(
            obj.requests.status === 'Success' ? BlueboardLoloRequestFactory.getResponse(obj.requests.data) : null,
            obj.inventory.status === 'Success' ? BlueboardInventoryFactory.getResponse(obj.inventory.data) : null,
            obj.grades.status === 'Success' ? BlueboardKretaGradeDataFactory.getResponse(obj.grades.data) : null,
            obj.store.status === 'Success' ? BlueboardProductFactory.getResponse(obj.store.data) : null,
            obj.lolo.status === 'Success' ? BlueboardLoloResponseFactory.getResponse(obj.lolo.data) : null
        );
    }
}

export default BlueboardBootResponseFactory;

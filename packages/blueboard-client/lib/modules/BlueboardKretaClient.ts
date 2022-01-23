import BlueboardBaseClient from '../BlueboardBaseClient';
import BlueboardKretaGradeDataFactory from '../factories/BlueboardKretaGradeDataFactory';

class BlueboardKretaClient extends BlueboardBaseClient {
    public grades = async (refresh: false) => {
        const url = this.endpoints.kreta.grades;

        const res = BlueboardKretaGradeDataFactory.getResponse(await this.stdGetRequest(url, {}, { refresh: refresh }));

        return res;
    };
}

export default BlueboardKretaClient;

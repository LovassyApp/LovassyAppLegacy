import BlueboardBaseClient from '../BlueboardBaseClient';
import BlueboardLoloResponseFactory from '../factories/BlueboardLoloResponseFactory';

class BlueboardLoloClient extends BlueboardBaseClient {
    public get = async (refresh: false) => {
        const url = this.endpoints.lolo;

        const res = BlueboardLoloResponseFactory.getResponse(await this.stdGetRequest(url, {}, { refresh: refresh }));

        return res;
    };
}

export default BlueboardLoloClient;

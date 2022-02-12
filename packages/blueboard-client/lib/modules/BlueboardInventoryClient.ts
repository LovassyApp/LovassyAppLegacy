import BlueboardBaseClient from '../BlueboardBaseClient';
import BlueboardInventoryFactory from '../factories/BlueboardInventoryFactory';

class BlueboardInventoryClient extends BlueboardBaseClient {
    public items = async () => {
        const url = this.endpoints.inventory;

        const res = BlueboardInventoryFactory.getResponse(await this.stdGetRequest(url));

        return res;
    };
}

export default BlueboardInventoryClient;

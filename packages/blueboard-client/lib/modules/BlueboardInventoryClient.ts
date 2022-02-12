import { BlueboardCodeValidationResponse } from '..';
import BlueboardBaseClient from '../BlueboardBaseClient';
import BlueboardInventoryFactory from '../factories/BlueboardInventoryFactory';

class BlueboardInventoryClient extends BlueboardBaseClient {
    public items = async () => {
        const url = this.endpoints.inventory;

        const res = BlueboardInventoryFactory.getResponse(await this.stdGetRequest(url));

        return res;
    };

    public verifyCode = async (codeData: string) => {
        const url = this.endpoints.inventory;

        const res = await this.stdPostRequest(url, {
            code: codeData,
        });

        const ret = new BlueboardCodeValidationResponse(
            res.codeName,
            BlueboardInventoryFactory.getResponse(res.usableItems)
        );

        return ret;
    };

    public useItem = async (
        itemID: number,
        codeData: string = '',
        inputs: { [key: string]: string | boolean } = {}
    ) => {
        const url = this.endpoints.inventory;

        const res = BlueboardInventoryFactory.getItem(
            await this.stdPatchRequest(url, { code: codeData ?? '', itemID: itemID, inputs: inputs })
        );

        return res;
    };
}

export default BlueboardInventoryClient;

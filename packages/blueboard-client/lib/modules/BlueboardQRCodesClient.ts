import BlueboardBaseClient from '../BlueboardBaseClient';
import BlueboardResponse from '../models/BlueboardResponse';
import BlueboardQRCodeFactory from '../factories/BlueboardQRCodeFactory';

class BlueboardQRCodesClient extends BlueboardBaseClient {
    public all = async () => {
        const url = this.endpoints.admin.qrcodes;

        const res = BlueboardQRCodeFactory.getResponse(await this.stdGetRequest(url));

        return res;
    };

    public save = async (name: string, email: string) => {
        const url = this.endpoints.admin.qrcodes;

        const res = (await this.stdPutRequest(url, {
            name: name,
            email: email,
        })) as BlueboardResponse;

        return res;
    };

    public delete = async (id: number) => {
        const data: { id: number } = { id: id };
        const url = this.endpoints.admin.qrcodes;

        const res = (await this.stdDeleteRequest(url, data)) as BlueboardResponse;

        return res;
    };
}

export default BlueboardQRCodesClient;

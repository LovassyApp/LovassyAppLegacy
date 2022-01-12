import BlueboardBaseClient from "../BlueboardBaseClient";
import BlueboardLoloResponseFactory from "../factories/BlueboardLoloResponseFactory";

class BlueboardLoloClient extends BlueboardBaseClient {
    public get = async () => {
        const url = this.endpoints.lolo;

        const res = BlueboardLoloResponseFactory.getResponse(
            await this.stdGetRequest(url)
        );

        return res;
    };
}

export default BlueboardLoloClient;

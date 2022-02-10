import BlueboardBaseClient from "../BlueboardBaseClient";
import BlueboardProduct from "../models/BlueboardProduct";
import BlueboardResponse from "../models/BlueboardResponse";

class BlueboardStoreClient extends BlueboardBaseClient {
    public all = async (forcedToken?: string) => {
        const url = this.endpoints.store;

        if (forcedToken) {
            return (await this.stdGetRequest(
                url,
                {},
                {},
                {
                    Authorization: "Bearer " + forcedToken,
                    Accept: "application/json",
                }
            )) as Array<BlueboardProduct[]>;
        }

        return (await this.stdGetRequest(url)) as Array<BlueboardProduct>;
    };

    public buy = async (id: number) => {
        const data: { productId: number } = { productId: id };
        const url = this.endpoints.store;

        const res = (await this.stdPostRequest(url, data)) as BlueboardResponse;

        return res;
    };
}

export default BlueboardStoreClient;

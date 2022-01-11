import BlueboardBaseClient from "../BlueboardBaseClient";
import BlueboardProduct from "../models/BlueboardProduct";
import BlueboardResponse from "../models/BlueboardResponse";
import BlueboardProductFactory from "../factories/BlueboardProductFactory";

class BlueboardProductsClient extends BlueboardBaseClient {
    public all = async () => {
        const url = this.endpoints.admin.products;

        const res = BlueboardProductFactory.getResponse(
            await this.stdGetRequest(url)
        );

        return res;
    };

    public get = async (id: number) => {
        const url = this.endpoints.admin.products + `/${id}`;

        const res = BlueboardProductFactory.getResponse(
            await this.stdGetRequest(url)
        );

        return res;
    };

    public save = async (data: any) => {
        const url = this.endpoints.admin.products;

        const res =
            data.id === "new"
                ? ((await this.stdPutRequest(url, data)) as BlueboardResponse)
                : ((await this.stdPatchRequest(
                      url,
                      data
                  )) as BlueboardResponse);

        return res;
    };

    public delete = async (id: number) => {
        const data: { id: number } = { id: id };
        const url = this.endpoints.admin.products;

        const res = (await this.stdDeleteRequest(
            url,
            data
        )) as BlueboardResponse;

        return res;
    };
}

export default BlueboardProductsClient;

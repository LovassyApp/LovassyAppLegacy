import BlueboardBaseClient from "../BlueboardBaseClient";
import BlueboardLoloResponseFactory from "../factories/BlueboardLoloResponseFactory";

class BlueboardLoloClient extends BlueboardBaseClient {
    public get = async (refresh: boolean = false, forcedToken?: string) => {
        const url = this.endpoints.lolo;

        const res = BlueboardLoloResponseFactory.getResponse(
            forcedToken
                ? await this.stdGetRequest(
                      url,
                      {},
                      { refresh: refresh },
                      {
                          Authorization: "Bearer " + forcedToken,
                          Accept: "application/json",
                      }
                  )
                : await this.stdGetRequest(url, {}, { refresh: refresh })
        );

        return res;
    };
}

export default BlueboardLoloClient;

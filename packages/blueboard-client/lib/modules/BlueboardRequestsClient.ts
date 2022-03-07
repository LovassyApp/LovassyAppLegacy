import { BlueboardLoloRequestAction, BlueboardLoloRequestFactory } from '..';

import BlueboardBaseClient from '../BlueboardBaseClient';

class BlueboardRequestsClient extends BlueboardBaseClient {
    public get = async (forcedToken?: string) => {
        const url = this.endpoints.requests.base;

        const res = BlueboardLoloRequestFactory.getResponse(
            forcedToken
                ? await this.stdGetRequest(
                      url,
                      {},
                      {},
                      {
                          Authorization: 'Bearer ' + forcedToken,
                          Accept: 'application/json',
                      }
                  )
                : await this.stdGetRequest(url)
        );

        return res;
    };

    public all = async (forcedToken?: string) => {
        const url = this.endpoints.requests.all;

        const res = BlueboardLoloRequestFactory.getResponse(
            forcedToken
                ? this.stdGetRequest(
                      url,
                      {},
                      {},
                      {
                          Authorization: 'Bearer ' + forcedToken,
                          Accept: 'application/json',
                      }
                  )
                : await this.stdGetRequest(url)
        );

        return res;
    };

    public make = async (title: string, body: string) => {
        const url = this.endpoints.requests.base;

        const res = BlueboardLoloRequestFactory.getItem(
            await this.stdPutRequest(url, { title: title, body: body })
        );

        return res;
    };

    public update = async (
        id: number,
        verdict: BlueboardLoloRequestAction,
        amount?: number
    ) => {
        console.log(amount);
        const data = {
            id: id,
            verdict: verdict,
            loloAmount: amount ?? undefined,
        };

        const url = this.endpoints.requests.all;

        const res = BlueboardLoloRequestFactory.getItem(
            await this.stdPatchRequest(url, data)
        );

        return res;
    };
}

export default BlueboardRequestsClient;

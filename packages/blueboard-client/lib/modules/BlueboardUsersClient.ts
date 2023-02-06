import BlueboardBaseClient from '../BlueboardBaseClient';
import { BlueboardUserFactory } from '../factories';
import BlueboardResponse from '../models/BlueboardResponse';
import BlueboardUser from '../models/BlueboardUser';

class BlueboardUsersClient extends BlueboardBaseClient {
    public all = async () => {
        const url = this.endpoints.admin.users;

        const res = (await this.stdGetRequest(url)) as Array<any>;

        return BlueboardUserFactory.getResponse(res);
    };

    public get = async (id: number) => {
        const url = this.endpoints.admin.users + `/${id}`;

        const res = await this.stdGetRequest(url);

        return BlueboardUserFactory.getUser(res);
    };

    public save = async (data: BlueboardUser) => {
        const url = this.endpoints.admin.users;

        const res = (await this.stdPatchRequest(
            url,
            data
        )) as BlueboardResponse;

        return res;
    };

    public delete = async (id: number) => {
        const data: { id: number } = { id: id };
        const url = this.endpoints.admin.users;

        const res = (await this.stdDeleteRequest(
            url,
            data
        )) as BlueboardResponse;

        return res;
    };
}

export default BlueboardUsersClient;

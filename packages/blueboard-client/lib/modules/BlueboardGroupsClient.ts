import BlueboardBaseClient from '../BlueboardBaseClient';
import BlueboardResponse from '../models/BlueboardResponse';
import BlueboardUserGroup from '../models/BlueboardUserGroup';

class BlueboardGroupsClient extends BlueboardBaseClient {
    public all = async () => {
        const url = this.endpoints.admin.permissions.groups;

        const res = (await this.stdGetRequest(url)) as Array<BlueboardUserGroup>;

        return res;
    };

    public delete = async (id: number) => {
        const data: { id: number } = { id: id };
        const url = this.endpoints.admin.permissions.groups;

        const res = (await this.stdDeleteRequest(url, data)) as BlueboardResponse;

        return res;
    };

    public save = async (data: BlueboardUserGroup) => {
        const url = this.endpoints.admin.permissions.groups;

        const res =
            data.id === 'new'
                ? ((await this.stdPutRequest(url, data)) as BlueboardResponse)
                : ((await this.stdPatchRequest(url, data)) as BlueboardResponse);

        return res;
    };

    public get = async (id: number) => {
        const url = this.endpoints.admin.permissions.groups + `/${id}`;

        const res = (await this.stdGetRequest(url)) as BlueboardUserGroup;

        return res;
    };
}

export default BlueboardGroupsClient;

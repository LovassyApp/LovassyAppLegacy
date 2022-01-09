import BlueboardBaseClient from '../BlueboardBaseClient';
import BlueboardPermissionScope from '../models/BlueboardPermissionScope';

class BlueboardScopesClient extends BlueboardBaseClient {
	public all = async () => {
		const url = this.endpoints.admin.permissions.scopes;

		const res = (await this.stdGetRequest(url)) as Array<BlueboardPermissionScope>;

		return res;
	};
}

export default BlueboardScopesClient;

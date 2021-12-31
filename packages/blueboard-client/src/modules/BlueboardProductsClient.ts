import BlueboardBaseClient from '../BlueboardBaseClient';
import BlueboardProduct from '../models/BlueboardProduct';
import BlueboardResponse from '../models/BlueboardResponse';

class BlueboardProductsClient extends BlueboardBaseClient {
	public all = async () => {
		const url = this.endpoints.admin.products;

		const res = (await this.stdGetRequest(url)) as Array<BlueboardProduct>;

		return res;
	};

	public get = async (id: number) => {
		const url = this.endpoints.admin.products + `/${id}`;

		const res = (await this.stdGetRequest(url)) as BlueboardProduct;

		return res;
	};

	public save = async (data: BlueboardProduct) => {
		const url = this.endpoints.admin.products;

		const res =
			data.id === 'new'
				? ((await this.stdPutRequest(url, data)) as BlueboardResponse)
				: ((await this.stdPatchRequest(url, data)) as BlueboardResponse);

		return res;
	};

	public delete = async (id: number) => {
		const data: { id: number } = { id: id };
		const url = this.endpoints.admin.products;

		const res = (await this.stdDeleteRequest(url, data)) as BlueboardResponse;

		return res;
	};
}

export default BlueboardProductsClient;

import BlueboardBaseClient from '../BlueboardBaseClient';
import BlueboardProduct from '../models/BlueboardProduct';
import BlueboardResponse from '../models/BlueboardResponse';

class BlueboardStoreClient extends BlueboardBaseClient {
	public all = async () => {
		const url = this.endpoints.store;

		const res = (await this.stdGetRequest(url)) as Array<BlueboardProduct>;

		return res;
	};

	public buy = async (id: number) => {
		const data: { productId: number } = { productId: id };
		const url = this.endpoints.store;

		const res = (await this.stdPostRequest(url, data)) as BlueboardResponse;

		return res;
	};
}

export default BlueboardStoreClient;

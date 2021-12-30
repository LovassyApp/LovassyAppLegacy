import BlueboardBaseClient from '../BlueboardBaseClient';
import BlueboardQRCode from '../models/BlueboardQRCode';
import BlueboardResponse from '../models/BlueboardResponse';

class BlueboardQRCodesClient extends BlueboardBaseClient {
	public all = async () => {
		const url = this.endpoints.admin.qrcodes;

		const res = (await this.stdGetRequest(url)) as Array<BlueboardQRCode>;

		return res;
	};

	public save = async (name: string) => {
		const url = this.endpoints.admin.qrcodes;

		const res = (await this.stdPostRequest(url, { name: name })) as BlueboardResponse;

		return res;
	};

	public delete = async (id: number) => {
		const data: { id: number } = { id: id };
		const url = this.endpoints.admin.qrcodes;

		const res = (await this.stdDeleteRequest(url, data)) as BlueboardResponse;

		return res;
	};
}

export default BlueboardQRCodesClient;

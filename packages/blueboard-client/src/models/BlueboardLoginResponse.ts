import BlueboardResponse from './BlueboardResponse';
import BlueboardUser from './BlueboardUser';

class BlueboardLoginResponse extends BlueboardResponse {
	public readonly user: BlueboardUser | null = null;
	public readonly token: string | null = null;

	constructor(message: string, result: string, status: number, user: BlueboardUser, token: string) {
		super(message, result, status);
		this.user = user;
		this.token = token;
	}
}

interface BlueboardLoginResponseInterface {
	message: string;
	result: string;
	user: BlueboardUser;
	token: string;
}

export type { BlueboardLoginResponseInterface };

export default BlueboardLoginResponse;

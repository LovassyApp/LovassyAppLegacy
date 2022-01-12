import BlueboardResponse from "./BlueboardResponse";
import BlueboardUser from "./BlueboardUser";

class BlueboardLoginResponse extends BlueboardResponse {
    public readonly user: BlueboardUser;
    public readonly token: string;
    public readonly rememberToken: string;

    constructor(
        result: string,
        message: string,
        status: number,
        user: BlueboardUser,
        token: string,
        rememberToken: string
    ) {
        super(message, result, status);
        this.user = user;
        this.token = token;
        this.rememberToken = rememberToken;
    }
}

export default BlueboardLoginResponse;

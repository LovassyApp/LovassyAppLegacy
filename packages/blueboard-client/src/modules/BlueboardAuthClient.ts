import BlueboardLoginResponse, {
  BlueboardLoginResponseInterface,
} from "../models/BlueboardLoginResponse";
import axios, { AxiosRequestConfig } from "axios";

import BlueboardBaseClient from "../BlueboardBaseClient";
import BlueboardLoginException from "../errors/BlueboardLoginException";
import BlueboardLogoutException from "../errors/BlueboardLogoutException";

class BlueboardAuthClient extends BlueboardBaseClient {
  public login = async (
    username: string,
    password: string,
    remember: boolean
  ) => {
    const url: string = this.endpoints.auth.login;

    var data = {
      email: username,
      password: password,
      remember: Number(remember),
    };

    return await this.stdPostRequest(url, data).then((res) => {
      const data = res.data;
      const obj = new BlueboardLoginResponse(
        data.message,
        data.result,
        res.status,
        data.user,
        data.token
      );
      return obj;
    });
  };

  public logout = async () => {
    const url = this.endpoints.auth.logout;

    return this.axios
      .get(url)
      .then(() => {
        return true;
      })
      .catch((error) => {
        throw new BlueboardLogoutException(error.message);
      });
  };

  public loginWithCookie = async () => {
    const url = this.endpoints.auth.login;

    return this.axios
      .get(url)
      .then((res) => {
        const data = res.data as BlueboardLoginResponseInterface;
        const obj = new BlueboardLoginResponse(
          data.message,
          data.result,
          res.status,
          data.user,
          data.token
        );
        return obj;
      })
      .catch((error) => {
        throw new BlueboardLoginException({}, error.message, false);
      });
  };
}

export default BlueboardAuthClient;

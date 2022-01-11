import BlueboardLoginResponse, {
  BlueboardLoginResponseInterface,
} from "../models/BlueboardLoginResponse";
import BlueboardBaseClient from "../BlueboardBaseClient";
import BlueboardLoginException from "../errors/BlueboardLoginException";
import BlueboardLogoutException from "../errors/BlueboardLogoutException";
import BlueboardRegisterException from "../errors/BlueboardRegisterException";

class BlueboardAuthClient extends BlueboardBaseClient {
  public register = async (
    email: string,
    password: string,
    kretaUsername: string,
    kretaPassword: string
  ) => {
    const url: string = this.endpoints.auth.register;

    var data = {
      email: email,
      password: password,
      kreta_username: kretaUsername,
      kreta_password: kretaPassword,
    };

    return await this.stdPostRequest(url, data, {}, {})
      .then((res) => {
        return true;
      })
      .catch((error) => {
        if (error.type != null && error.type == "KretaCredentialException") {
          throw new BlueboardRegisterException({}, error.message, true);
        } else {
          throw new BlueboardRegisterException(
            error.errors,
            error.message,
            false
          );
        }
      });
  };

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

    return await this.stdPostRequest(url, data, {}, {})
      .then((res) => {
        const obj = new BlueboardLoginResponse(
          res.message,
          res.result,
          res.status,
          res.user,
          res.token
        );
        return obj;
      })
      .catch((error) => {
        throw new BlueboardLoginException(error.errors, error.message, false);
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
        throw new BlueboardLoginException({}, error.message, true);
      });
  };
}

export default BlueboardAuthClient;
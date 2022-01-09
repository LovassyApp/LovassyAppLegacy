import BlueboardAuthClient from "./BlueboardAuthClient";
import BlueboardBaseClient from "../BlueboardBaseClient";
import BlueboardClientModuleConfig from "../models/BlueboardClientModuleConfig";
import BlueboardControlException from "../errors/BlueboardControlException";
import BlueboardTokenRefreshException from "../errors/BlueboardTokenRefreshException";

class BlueboardTokenRefresher extends BlueboardBaseClient {
  private timeout: any;
  private auth: BlueboardAuthClient;

  constructor(config: BlueboardClientModuleConfig) {
    super(config);
    this.auth = new BlueboardAuthClient(config);
  }

  private getTimeout = async () => {
    const expiry = this.state.control?.session.expiry ?? false;

    if (expiry == false) {
      throw new BlueboardControlException("Please fetch Control first.");
    }

    return (expiry - Math.floor(Date.now() / 1000) - 2) * 1000;
  };

  public async start(refreshCallback: any, errorCallback: any) {
    clearTimeout(this.timeout);
    const timeout = await this.getTimeout();
    console.log(
      "DEBUG: Token expiry thread sleep: " + timeout / 1000 + " seconds."
    );

    const cb = () => {
      this.timeoutCallback(refreshCallback, errorCallback);
    };

    this.timeout = setTimeout(cb, timeout);
  }

  public stop = () => {
    clearTimeout(this.timeout);
  };

  private timeoutCallback = async (
    refreshCallback: any,
    errorCallback: any
  ) => {
    console.log("DEBUG: Renewing token...");
    try {
      await this.auth
        .loginWithCookie()
        .then(refreshCallback)
        .catch((err) => {
          throw new BlueboardTokenRefreshException(err.message);
        });
    } catch (e) {
      errorCallback(e);
    }
  };
}

export default BlueboardTokenRefresher;

import BlueboardBaseClient from "../BlueboardBaseClient";
import BlueboardControl from "../models/BlueboardControl";
import BlueboardControlException from "../errors/BlueboardControlException";

class BlueboardAccountClient extends BlueboardBaseClient {
  public async control(forcedToken?: string) {
    const url = this.endpoints.control;
    const res = await this.stdGetRequest(
      url,
      {},
      {},
      forcedToken
        ? {
            Authorization: "Bearer " + forcedToken,
            Accept: "application/json",
          }
        : null
    ).catch(() => {
      throw new BlueboardControlException("Control fetching error.");
    });

    const cObj = new BlueboardControl(res.user, res.session, res.permissions);

    this.state.control = cObj;

    return cObj;
  }
}

export default BlueboardAccountClient;

import BlueboardAccountClient from "./modules/BlueboardAccountClient";
import BlueboardAuthClient from "./modules/BlueboardAuthClient";
import BlueboardClientModuleConfig from "./models/BlueboardClientModuleConfig";
import BlueboardEndpoints from "./BlueboardEndpoints";
import BlueboardGroupsClient from "./modules/BlueboardGroupsClient";
import BlueboardProductsClient from "./modules/BlueboardProductsClient";
import BlueboardQRCodesClient from "./modules/BlueboardQRCodesClient";
import BlueboardScopesClient from "./modules/BlueboardScopesClient";
import BlueboardSocketException from "./errors/BlueboardSocketException";
import BlueboardState from "./models/BlueboardState";
import BlueboardTokenRefresher from "./modules/BlueboardTokenRefresher";
import BlueboardUsersClient from "./modules/BlueboardUsersClient";
import Echo from "laravel-echo";

class BlueboardClient {
  public readonly auth: BlueboardAuthClient;
  public readonly account: BlueboardAccountClient;
  public readonly renew: BlueboardTokenRefresher;
  public readonly groups: BlueboardGroupsClient;
  public readonly scopes: BlueboardScopesClient;
  public readonly products: BlueboardProductsClient;
  public readonly qrcodes: BlueboardQRCodesClient;
  public readonly users: BlueboardUsersClient;

  private state: BlueboardState = new BlueboardState();

  constructor(blueboardUrl: string, apiToken?: string) {
    const config = new BlueboardClientModuleConfig(
      blueboardUrl,
      this.state,
      apiToken
    );

    this.auth = new BlueboardAuthClient(config);
    this.account = new BlueboardAccountClient(config);
    this.renew = new BlueboardTokenRefresher(config);
    this.groups = new BlueboardGroupsClient(config);
    this.scopes = new BlueboardScopesClient(config);
    this.products = new BlueboardProductsClient(config);
    this.qrcodes = new BlueboardQRCodesClient(config);
    this.users = new BlueboardUsersClient(config);
  }
}

class BlueboardSocketManager {
  private echo: Echo | null = null;
  private options: object;

  constructor(
    blueboardUrl: string,
    blueboardSoketiUrl: string,
    blueboardSoketiKey: string,
    token?: string
  ) {
    const endpoints = new BlueboardEndpoints(blueboardUrl);

    this.options = {
      broadcaster: "pusher",
      key: blueboardSoketiKey,
      wsHost: blueboardSoketiUrl,
      wsPort: 6001,
      forceTLS: false,
      encrypted: true,
      disableStats: true,
      enabledTransports: ["ws", "wss"],
      authEndpoint: endpoints.auth.socket,
      auth: {
        headers: {
          Authorization: `Bearer ${token ?? ""}`,
          Accept: "application/json",
        },
      },
    };
  }

  public connect = () => {
    try {
      this.echo = new Echo(this.options);
    } catch (e) {
      const err = e as any;
      throw new BlueboardSocketException(err.message ?? "WebSocket error.");
    }

    return true;
  };

  public disconnect = () => {
    if (this.echo instanceof Echo) {
      this.echo.disconnect();
      this.echo = null;
    } else {
      throw new BlueboardSocketException("The socket isn't connected.");
    }
  };

  public getEcho = () => {
    if (this.echo instanceof Echo) {
      return this.echo;
    } else {
      throw new BlueboardSocketException("The socket isn't connected.");
    }
  };
}

export { BlueboardClient, BlueboardSocketManager };

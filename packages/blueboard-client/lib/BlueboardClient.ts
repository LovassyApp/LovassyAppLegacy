import BlueboardClientModuleConfig from "./models/BlueboardClientModuleConfig";
import BlueboardAccountClient from "./modules/BlueboardAccountClient";
import BlueboardAuthClient from "./modules/BlueboardAuthClient";
import BlueboardGroupsClient from "./modules/BlueboardGroupsClient";
import BlueboardProductsClient from "./modules/BlueboardProductsClient";
import BlueboardQRCodesClient from "./modules/BlueboardQRCodesClient";
import BlueboardScopesClient from "./modules/BlueboardScopesClient";
import BlueboardState from "./models/BlueboardState";
import BlueboardTokenRefresher from "./modules/BlueboardTokenRefresher";
import BlueboardUsersClient from "./modules/BlueboardUsersClient";
import BlueboardStoreClient from "./modules/BlueboardStoreClient";
import BlueboardLoloClient from "./modules/BlueboardLoloClient";

class BlueboardClient {
    public readonly auth: BlueboardAuthClient;
    public readonly account: BlueboardAccountClient;
    public readonly renew: BlueboardTokenRefresher;
    public readonly groups: BlueboardGroupsClient;
    public readonly scopes: BlueboardScopesClient;
    public readonly products: BlueboardProductsClient;
    public readonly qrcodes: BlueboardQRCodesClient;
    public readonly users: BlueboardUsersClient;
    public readonly store: BlueboardStoreClient;
    public readonly lolo: BlueboardLoloClient;

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
        this.store = new BlueboardStoreClient(config);
        this.lolo = new BlueboardLoloClient(config);
    }
}

export default BlueboardClient;

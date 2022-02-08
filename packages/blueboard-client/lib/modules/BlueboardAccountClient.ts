import BlueboardBaseClient from '../BlueboardBaseClient';
import BlueboardControl from '../models/BlueboardControl';
import BlueboardControlException from '../errors/BlueboardControlException';
import { BlueboardUnavailableException } from '..';

class BlueboardAccountClient extends BlueboardBaseClient {
    public async control(forcedToken?: string) {
        const url = this.endpoints.control;
        const res = await this.stdGetRequest(
            url,
            {},
            {},
            forcedToken
                ? {
                      Authorization: 'Bearer ' + forcedToken,
                      Accept: 'application/json',
                  }
                : null
        ).catch(() => {
            throw new BlueboardControlException('Control fetching error.');
        });

        const cObj = new BlueboardControl(res.user, res.session, res.permissions);

        this.state.control = cObj;

        return cObj;
    }

    public async ping() {
        const url = this.endpoints.ping;

        const res = await this.stdGetRequest(url, {}, {}, { Accept: 'application/json' }).catch(() => {
            throw new BlueboardUnavailableException('Blueboard is down');
        });

        return res;
    }
}

export default BlueboardAccountClient;

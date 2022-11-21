import { BlueboardUnavailableException, BlueboardUserFactory } from '..';

import BlueboardBaseClient from '../BlueboardBaseClient';
import { BlueboardBootResponseFactory } from '../factories';
import BlueboardControl from '../models/BlueboardControl';
import BlueboardControlException from '../errors/BlueboardControlException';
import BlueboardAboutResponse from '../models/BlueboardAboutResponse';

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

        const cObj = new BlueboardControl(
            BlueboardUserFactory.getUser(res.user),
            res.session,
            res.permissions,
            res.groups
        );

        this.state.control = cObj;

        return cObj;
    }

    public async ping() {
        const url = this.endpoints.ping;

        const res = await this.stdGetRequest(
            url,
            {},
            {},
            { Accept: 'application/json' }
        ).catch(() => {
            throw new BlueboardUnavailableException('Blueboard is down');
        });

        return res;
    }

    public async about() {
        const url = this.endpoints.about;

        const res = await this.stdGetRequest(
            url,
            {},
            { sendOk: true },
            { Accept: 'application/json' }
        );

        return new BlueboardAboutResponse(
            res.whoami,
            res.php_version,
            res.laravel_version,
            res.blueboard_version,
            res.contributors,
            res.repository,
            res.motd
        );
    }

    public async boot(refresh: boolean = false, forcedToken?: string) {
        const url = this.endpoints.boot;

        const res = BlueboardBootResponseFactory.getResponse(
            forcedToken
                ? await this.stdGetRequest(
                      url,
                      {},
                      { refresh: refresh },
                      {
                          Authorization: 'Bearer ' + forcedToken,
                          Accept: 'application/json',
                      }
                  )
                : await this.stdGetRequest(url, {}, { refresh: refresh })
        );

        return res;
    }
}

export default BlueboardAccountClient;

import axios, { Axios, AxiosRequestConfig } from 'axios';
import BlueboardEndpoints from './BlueboardEndpoints';
import BlueboardAccessDeniedException from './errors/BlueboardAccessDeniedException';
import BlueboardNotFoundException from './errors/BlueboardNotFoundException';
import BlueboardStdException from './errors/BlueboardStdException';
import BlueboardTokenException from './errors/BlueboardTokenException';
import BlueboardValidationException from './errors/BlueboardValidationException';
import BlueboardClientModuleConfig from './models/BlueboardClientModuleConfig';
import BlueboardState from './models/BlueboardState';

class BlueboardBaseClient {
    protected readonly endpoints: BlueboardEndpoints;
    protected readonly token: string = '';
    protected state: BlueboardState;
    private readonly headers: any = {};
    protected axios: Axios;

    private handleAPIErrors = (err: any) => {
        switch (err.response.status) {
            case 404:
                throw new BlueboardNotFoundException(
                    'The resource could not be found. (' + err.request.responseURL + ')'
                );
            case 403:
                throw new BlueboardAccessDeniedException(
                    "You don't have the permission to access this resource. (" + err.request.responseURL + ')'
                );
            case 422:
                throw new BlueboardValidationException(err.response.data.errors ?? {}, err.response.data.message);
            default:
                throw new BlueboardStdException(
                    err.response.data.message,
                    err.response.data.type ?? 'BlueboardGenericException'
                );
        }
    };

    private registerInterceptor = () => {
        this.axios.interceptors.response.use(
            (res) => {
                return res;
            },
            (err) => {
                if (err.response) {
                    this.handleAPIErrors(err);
                } else {
                    throw new BlueboardStdException(err.message);
                }
            }
        );
    };

    constructor(config: BlueboardClientModuleConfig) {
        this.endpoints = new BlueboardEndpoints(config.blueboardUrl);

        if (config.apiToken) {
            this.token = config.apiToken;
            this.headers = {
                Authorization: 'Bearer ' + config.apiToken,
                Accept: 'application/json',
            };
        }

        this.axios = axios.create({ withCredentials: config.cookies });
        this.registerInterceptor();

        this.state = config.state;
    }

    /*
        Axios vs React Native: Round 1
    */
    private configFilter(config: AxiosRequestConfig): AxiosRequestConfig {
        const mutatedConfig: AxiosRequestConfig = { ...config };

        const dataLength: number = Object.keys(mutatedConfig.data).length;
        const paramLength: number = Object.keys(mutatedConfig.params).length;

        if (paramLength === 0) {
            delete mutatedConfig.params;
        }

        if (dataLength === 0) {
            delete mutatedConfig.data;
        }

        return mutatedConfig;
    }

    protected async stdRequest(config: AxiosRequestConfig) {
        return (await this.axios.request(this.configFilter(config))) as any;
    }

    protected async stdGetRequest(url: string, data: any = {}, params: any = {}, forcedHeaders?: any) {
        if (this.token == '' && forcedHeaders == null) {
            throw new BlueboardTokenException('No token supplied.');
        }

        const config: any = {
            method: 'get',
            url: url,
            headers: forcedHeaders ?? this.headers,
            data: data,
            params: params,
        };

        const res = await this.stdRequest(config);

        return res.data.data == null ? res.data ?? {} : res.data.data;
    }

    protected async stdPostRequest(url: string, data: any, params: any = {}, forcedHeaders?: any) {
        if (this.token == '' && forcedHeaders == null) {
            throw new BlueboardTokenException('No token supplied.');
        }

        const config: any = {
            method: 'post',
            url: url,
            headers: forcedHeaders ?? this.headers,
            data: data,
            params: params,
        };

        const res = await this.stdRequest(config);

        return res.data.data == null ? res.data ?? {} : res.data.data;
    }

    protected async stdPutRequest(url: string, data: any, params: any = {}, forcedHeaders?: any) {
        if (this.token == '' && forcedHeaders == null) {
            throw new BlueboardTokenException('No token supplied.');
        }

        const config: any = {
            method: 'put',
            url: url,
            headers: forcedHeaders ?? this.headers,
            data: data,
            params: params,
        };

        const res = await this.stdRequest(config);

        return res.data.data == null ? res.data ?? {} : res.data.data;
    }

    protected async stdPatchRequest(url: string, data: any, params: any = {}, forcedHeaders?: any) {
        if (this.token == '' && forcedHeaders == null) {
            throw new BlueboardTokenException('No token supplied.');
        }

        const config: any = {
            method: 'patch',
            url: url,
            headers: forcedHeaders ?? this.headers,
            data: data,
            params: params,
        };

        const res = await this.stdRequest(config);

        return res.data.data == null ? res.data ?? {} : res.data.data;
    }

    protected async stdDeleteRequest(url: string, data: any, params: any = {}, forcedHeaders?: any) {
        if (this.token == '' && forcedHeaders == null) {
            throw new BlueboardTokenException('No token supplied.');
        }

        const config: any = {
            method: 'delete',
            url: url,
            headers: forcedHeaders ?? this.headers,
            data: data,
            params: params,
        };

        const res = await this.stdRequest(config);

        return res.data.data == null ? res.data ?? {} : res.data.data;
    }
}

export default BlueboardBaseClient;

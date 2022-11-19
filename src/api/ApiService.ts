import { AxiosError, AxiosInstance } from "axios";
import ServiceSingletonSelfBind from "../ioc/decorators/ServiceSingletonSelfBind.decorator";
import auth from "./resources/auth/auth.resource";
import user from "./resources/user/user.resource";
import account from "./resources/account/account.resource";
import currency from "./resources/currency/currency.resource";
import { inject } from "inversify";
import { getProviderKey } from "../ioc/container";
import { AXIOS_PROVIDER, CONFIG_PROVIDER } from "../providers";
import type { ProviderType } from "../ioc/types";

@ServiceSingletonSelfBind
export class ApiService {
  private readonly axiosInstance: AxiosInstance;
  public readonly resources: {
    auth: ReturnType<typeof auth>;
    user: ReturnType<typeof user>;
    account: ReturnType<typeof account>;
    currency: ReturnType<typeof currency>;
  };

  private ignoreToken = ["/auth/sign-in"];

  constructor(
    @inject(getProviderKey(CONFIG_PROVIDER))
    private readonly config: ProviderType<typeof CONFIG_PROVIDER>,
    @inject(getProviderKey(AXIOS_PROVIDER))
    private readonly axios: ProviderType<typeof AXIOS_PROVIDER>
  ) {
    this.axiosInstance = this.axios.create({
      baseURL: config.api.host,
      withCredentials: true,
    });

    this.resources = {
      auth: auth(this.axiosInstance),
      user: user(this.axiosInstance),
      account: account(this.axiosInstance),
      currency: currency(this.axiosInstance),
    };

    this.createJWTInterceptor();
  }

  createJWTInterceptor() {
    const refreshToken = () => {
      return this.axiosInstance.post(this.config.api.refreshTokenUrl, null, {
        _isRefreshRequest_: true,
      } as any);
    };

    let refreshTokenRequest: Promise<unknown> | null = null;

    this.axiosInstance.interceptors.request.use((config) => {
      config.headers = config.headers ? config.headers : {};
      config.headers = {
        ...config.headers,
        language: "uk",
      };
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (config) => config,
      (axiosError: AxiosError) => {
        if (
          this.ignoreToken.includes(axiosError.config.url as string) ||
          axiosError.response?.status !== 401 ||
          (axiosError.config as any)._isRefreshRequest_
        ) {
          throw axiosError;
        }

        if (!refreshTokenRequest) {
          refreshTokenRequest = refreshToken();
        }

        return refreshTokenRequest
          .then(() => {
            return this.axiosInstance.request(axiosError.config);
          })
          .finally(() => {
            refreshTokenRequest = null;
          });
      }
    );
  }
}

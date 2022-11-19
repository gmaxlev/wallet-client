import ServiceSingletonSelfBind from "../../ioc/decorators/ServiceSingletonSelfBind.decorator";
import { inject } from "inversify";
import { ApiService } from "../../api/ApiService";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { UserService } from "../../user/services/UserService";
import { AxiosError } from "axios";
import InjectFabricDecorator from "../../ioc/decorators/InjectFabric.decorator";
import type { FabricFactory } from "../../ioc/types";
import SignInDto from "../../api/resources/auth/SignIn.dto";
import SignUpDto from "../../api/resources/auth/SignUp.dto";

@ServiceSingletonSelfBind
export class AuthService {
  @observable user: UserService | null = null;

  private authorizeRequest: Promise<UserService | null> | null = null;

  constructor(
    @inject(ApiService)
    private readonly api: ApiService,
    @InjectFabricDecorator(UserService)
    private readonly userFactory: FabricFactory<typeof UserService>
  ) {
    makeObservable(this);
  }

  @computed
  get isLogin() {
    return !!this.user;
  }

  @action
  async logout() {
    await this.api.resources.auth.logout();
    runInAction(() => {
      this.user = null;
      this.authorizeRequest = null;
    });
  }

  @action
  async authorize(): Promise<UserService | null> {
    if (this.authorizeRequest) {
      return this.authorizeRequest;
    }

    this.authorizeRequest = this.api.resources.user
      .get()
      .then(({ data }) => {
        if (this.user) {
          return this.user;
        }
        runInAction(() => {
          this.user = this.userFactory(data);
        });
        return this.user;
      })
      .catch((e: unknown) => {
        if (e instanceof AxiosError && e.response?.status === 401) {
          return null;
        } else {
          throw e;
        }
      })
      .finally(() => {
        this.authorizeRequest = null;
      });

    return this.authorizeRequest;
  }

  async signIn({ email, password, remember }: SignInDto) {
    await this.api.resources.auth.signIn({ email, password, remember });
    return this.authorize();
  }

  async signUp({ email, password, name }: SignUpDto) {
    return this.api.resources.auth.signUp({ email, password, name });
  }
}

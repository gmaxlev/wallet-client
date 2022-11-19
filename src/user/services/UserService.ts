import { computed, makeObservable, observable } from "mobx";
import type UserDto from "../../api/resources/user/User.dto";
import { interfaces } from "inversify";
import { ServiceFabricSelfBind } from "../../ioc/decorators/ServiceFabricSelfBind.decorator";

@ServiceFabricSelfBind
export class UserService {
  @observable serverData: UserDto;

  constructor(serverData: UserDto) {
    this.serverData = serverData;
    makeObservable(this);
  }

  @computed
  get email() {
    return this.serverData.email;
  }

  @computed
  get name() {
    return this.serverData.name;
  }

  static factory = (context: interfaces.Context) => (serverData: UserDto) =>
    new UserService(serverData);
}

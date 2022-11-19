import ServiceSingletonSelfBind from "../../../ioc/decorators/ServiceSingletonSelfBind.decorator";
import { inject } from "inversify";
import { ApiService } from "../../../api/ApiService";
import { PaginatedRequest } from "../../../api/types";
import { CreateAccountDto } from "../../../api/resources/account/CreateAccount.dto";
import { UpdateAccountDto } from "../../../api/resources/account/UpdateAccount.dto";

@ServiceSingletonSelfBind
export class AccountsService {
  constructor(@inject(ApiService) private readonly apiService: ApiService) {}
  edit(id: number, data: UpdateAccountDto) {
    return this.apiService.resources.account.edit(id, data);
  }
  get(id: number) {
    return this.apiService.resources.account.get(id);
  }
  create(data: CreateAccountDto) {
    return this.apiService.resources.account.create(data);
  }
  getAll(params: PaginatedRequest) {
    return this.apiService.resources.account.getAll(params);
  }
  remove(id: number) {
    return this.apiService.resources.account.remove(id);
  }
}

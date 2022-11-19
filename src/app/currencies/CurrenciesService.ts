import ServiceSingletonSelfBind from "../../ioc/decorators/ServiceSingletonSelfBind.decorator";
import { inject } from "inversify";
import { ApiService } from "../../api/ApiService";

@ServiceSingletonSelfBind
export class CurrenciesService {
  constructor(@inject(ApiService) private readonly apiService: ApiService) {}
  getAll() {
    return this.apiService.resources.currency.getAll();
  }
}

import { inject } from "inversify";
import { ApiService } from "../../../api/ApiService";
import ServiceSingletonSelfBind from "../../../ioc/decorators/ServiceSingletonSelfBind.decorator";
import { PaginatedRequest } from "../../../api/types";
import CategoryCreateDto from "../../../api/resources/category/CategoryCreate.dto";
import CategoryUpdateDto from "../../../api/resources/category/CategoryUpdate.dto";

@ServiceSingletonSelfBind
export class CategoriesService {
  constructor(@inject(ApiService) private readonly apiService: ApiService) {}

  get(id: number) {
    return this.apiService.resources.category.get(id);
  }

  getAll(params: PaginatedRequest) {
    return this.apiService.resources.category.getAll(params);
  }

  create(data: CategoryCreateDto) {
    return this.apiService.resources.category.create(data);
  }

  update(id: number, data: CategoryUpdateDto) {
    return this.apiService.resources.category.update(id, data);
  }

  remove(id: number) {
    return this.apiService.resources.category.remove(id);
  }
}

import { AxiosInstance } from "axios";
import CategoryDto from "./Category.dto";
import { PaginatedRequest, PaginatedResponse } from "../../types";
import CategoryCreateDto from "./CategoryCreate.dto";

const create = (axios: AxiosInstance) => ({
  get(id: number) {
    return axios.get<CategoryDto>(`/category/${id}`);
  },
  getAll(params: PaginatedRequest) {
    return axios.get<PaginatedResponse<CategoryDto[]>>(`/category`, {
      params,
    });
  },
  create(data: CategoryCreateDto) {
    return axios.post<CategoryDto>("/category", data);
  },
  update(id: number, data: CategoryCreateDto) {
    return axios.put<CategoryDto>(`/category/${id}`, data);
  },
  remove(id: number) {
    return axios.delete<CategoryDto>(`/category/${id}`);
  },
});

export default create;

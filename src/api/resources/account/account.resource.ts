import { AxiosInstance } from "axios";
import { AccountDto } from "./Account.dto";
import { PaginatedRequest, PaginatedResponse } from "../../types";
import { CreateAccountDto } from "./CreateAccount.dto";
import { UpdateAccountDto } from "./UpdateAccount.dto";

const create = (axios: AxiosInstance) => ({
  get(id: number) {
    return axios.get<AccountDto>(`/account/${id}`);
  },
  getAll(params: PaginatedRequest) {
    return axios.get<PaginatedResponse<AccountDto[]>>("/account", {
      params,
    });
  },
  create(body: CreateAccountDto) {
    return axios.post<AccountDto>("/account", body);
  },
  edit(id: number, data: UpdateAccountDto) {
    return axios.put<AccountDto>(`/account/${id}`, data);
  },
  remove(id: number) {
    return axios.delete(`/account/${id}`);
  },
});

export default create;

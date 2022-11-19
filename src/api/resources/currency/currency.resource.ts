import { AxiosInstance } from "axios";
import { CurrencyDto } from "./Currency.dto";

const create = (axios: AxiosInstance) => ({
  getAll() {
    return axios.get<CurrencyDto[]>("/currency");
  },
});

export default create;

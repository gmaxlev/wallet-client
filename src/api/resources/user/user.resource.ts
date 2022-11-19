import { AxiosInstance } from "axios";
import UserDto from "./User.dto";

const create = (axios: AxiosInstance) => ({
  get() {
    return axios.get<UserDto>("/user");
  },
});

export default create;

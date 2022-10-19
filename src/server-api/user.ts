import { AxiosInstance } from "axios";
import { UserDTO } from "./dto";
const user = (client: AxiosInstance) => ({
  async get() {
    return client.get<UserDTO>("/user");
  },
});

export default user;

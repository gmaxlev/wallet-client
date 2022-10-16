import { AxiosInstance } from "axios";

const user = (client: AxiosInstance) => ({
  async get() {
    return client.get("/user");
  },
});

export default user;

import { AxiosInstance } from "axios";
import SignInDto from "./SignIn.dto";
import SignUpDto from "./SignUp.dto";

const create = (axios: AxiosInstance) => ({
  signIn({ email, password, remember }: SignInDto) {
    return axios.post("/auth/sign-in", {
      email,
      password,
      remember,
    });
  },

  signUp({ email, password, name }: SignUpDto) {
    return axios.post("/auth/sign-up", {
      email,
      password,
      name,
    });
  },

  logout() {
    return axios.post("/auth/logout");
  },
});

export default create;

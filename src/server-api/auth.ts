import { AxiosInstance } from "axios";

const auth = (client: AxiosInstance) => ({
  signIn({
    email,
    password,
    remember,
  }: {
    email: string;
    password: string;
    remember: boolean;
  }) {
    return client.post<{ token: string; refresh: string }>("/auth/sign-in", {
      email,
      password,
      remember,
    });
  },
  signUp({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    return client.post("/auth/sign-up", {
      email,
      password,
      name,
    });
  },

  logout() {
    return client.post("/auth/logout");
  },
});

export default auth;

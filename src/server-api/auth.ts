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
  signUp({ email, password }: { email: string; password: string }) {
    return client.post("/auth/sign-up", {
      email,
      password,
    });
  },

  logout() {
    return client.post("/auth/logout");
  },
});

export default auth;

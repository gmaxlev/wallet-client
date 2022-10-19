import api from "../../server-api";
import { SignInDto, SignUpDto } from "../types";
import { AxiosError } from "axios";
import { action, makeObservable, observable } from "mobx";
import user from "../../user/services/user";

class Auth {
  isLogin: boolean;

  constructor() {
    this.isLogin = false;
    makeObservable(this, {
      restore: action,
      isLogin: observable,
    });
  }

  async signIn({ email, password, remember }: SignInDto) {
    await api.auth.signIn({
      email,
      password,
      remember,
    });
    this.isLogin = true;
  }

  signUp({ email, password, name }: SignUpDto) {
    return api.auth.signUp({ email, password, name });
  }

  async logout(): Promise<void> {
    if (!this.isLogin) {
      return;
    }
    await api.auth.logout();
    this.isLogin = false;
  }

  async restore() {
    try {
      const { data } = await api.user.get();
      user.setUser(data);
      this.isLogin = true;
      return true;
    } catch (e: unknown) {
      if (e instanceof AxiosError && e.response?.status === 401) {
        return false;
      } else {
        throw e;
      }
    }
  }
}

export default new Auth();

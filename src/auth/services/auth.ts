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
  }

  signUp({ email, password }: SignUpDto) {
    return api.auth.signUp({ email, password });
  }

  async restore() {
    try {
      user.user = await api.user.get();
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

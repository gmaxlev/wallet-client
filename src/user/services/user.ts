import { makeObservable, observable, computed, action } from "mobx";
import { UserDTO } from "../../server-api/dto";

class User {
  user: UserDTO | null = null;

  constructor() {
    makeObservable(this, {
      user: observable,
      email: computed,
      setUser: action,
    });
  }

  setUser(user: UserDTO) {
    this.user = user;
  }

  get email() {
    return this.user?.email;
  }

  get name() {
    return this.user?.name;
  }
}

export default new User();

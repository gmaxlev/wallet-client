import { action, computed, makeObservable, observable } from "mobx";

export const User = new (class User {
  user: any = {
    email: 0,
  };

  constructor() {
    makeObservable(this, {
      user: observable,
      email: computed,
      change: action,
    });
  }
  change() {
    this.user.email += 1;
  }
  get email() {
    return this.user.email;
  }
})();

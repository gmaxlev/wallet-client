import { makeObservable, observable } from "mobx";

class User {
  user: any = null;

  constructor() {
    makeObservable(this, {
      user: observable,
    });
  }
}

export default new User();

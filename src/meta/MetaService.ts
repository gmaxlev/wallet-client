import { action, computed, makeObservable, observable } from "mobx";
import ServiceSingletonSelfBind from "../ioc/decorators/ServiceSingletonSelfBind.decorator";

@ServiceSingletonSelfBind
export class MetaService {
  @observable titleStack: string[] = [""];

  constructor() {
    makeObservable(this);
  }

  @action
  pushTitle(title: string) {
    this.titleStack.push(title);
  }

  @action
  popTitle() {
    this.titleStack.pop();
  }

  @computed
  get title() {
    return this.titleStack[this.titleStack.length - 1];
  }
}

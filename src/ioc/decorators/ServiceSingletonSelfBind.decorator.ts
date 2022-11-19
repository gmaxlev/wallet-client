import { injectable } from "inversify";
import { container } from "../container";
import { isTest } from "../../utils";

export default function ServiceSingletonSelfBind(
  target: new (...args: never) => unknown
) {
  injectable()(target);
  if (!isTest) {
    container.bind(target).toSelf().inSingletonScope();
  }
}

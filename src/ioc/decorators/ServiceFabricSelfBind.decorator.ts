import { injectable } from "inversify";
import { container } from "../container";
import { FabricClass } from "../types";

export function ServiceFabricSelfBind<T>(target: FabricClass<T>) {
  injectable()(target);
  container.bind(target).toDynamicValue(target.factory).inRequestScope();
}

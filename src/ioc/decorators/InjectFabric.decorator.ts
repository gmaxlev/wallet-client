import { inject, decorate } from "inversify";
import { FabricClass } from "../types";

export default function InjectFabricDecorator<T>(constructor: FabricClass<T>) {
  return (target: any, methodKey: string | undefined, index: number) => {
    decorate(inject(constructor), target, index);
  };
}

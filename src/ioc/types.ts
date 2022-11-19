import { interfaces } from "inversify";

export type FactoryMethod<T> = (
  context: interfaces.Context
) => (...args: any[]) => T;

export interface FabricClass<T> {
  factory: FactoryMethod<T>;
  new (...args: any[]): T;
}

export type FabricFactory<T extends FabricClass<unknown>> = ReturnType<
  T["factory"]
>;

export interface SymbolProvider<T = undefined> {
  key: symbol;
  type: T;
}

export type ProviderType<Type> = Type extends SymbolProvider<
  infer ProviderInterface
>
  ? ProviderInterface
  : never;

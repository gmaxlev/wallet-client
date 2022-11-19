import * as inversify from "inversify";
import { interfaces } from "inversify";
import React, { useMemo } from "react";
import { SymbolProvider } from "./types";

export function createContainer() {
  const container = new inversify.Container();

  const iOcContext = React.createContext(container);

  return {
    container,
    iOcContext,
    injectFn<F extends (...args: any[]) => ReturnType<F>>(
      deps: interfaces.ServiceIdentifier[],
      fn: (...injections: any[]) => F
    ) {
      let resolvedDeps: null | unknown[] = null;
      return (...rest: Parameters<F>) => {
        resolvedDeps = resolvedDeps
          ? resolvedDeps
          : deps.map((dep) => container.get(dep));
        return fn(...resolvedDeps)(...rest);
      };
    },
    useInject<T>(provide: interfaces.ServiceIdentifier) {
      return useMemo(() => container.get(provide), [provide]) as T;
    },
    defineProvider<T, R = SymbolProvider<T>>(description: string): R {
      return {
        key: Symbol(description),
      } as R;
    },
    getProviderKey(provider: SymbolProvider<unknown>) {
      return provider.key;
    },
  };
}

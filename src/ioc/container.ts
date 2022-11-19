import "reflect-metadata";
import { createContainer } from "./private-utils";

export const {
  container,
  useInject,
  injectFn,
  iOcContext,
  defineProvider,
  getProviderKey,
} = createContainer();

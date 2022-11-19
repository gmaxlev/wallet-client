import React from "react";
import { LoaderFunctionArgs, ShouldRevalidateFunction } from "react-router-dom";
import type { interfaces } from "inversify";
import { RouterMap } from "./generated/RouterMap";

export interface DefinedRoute {
  path?: string;
  index?: boolean;
  name: string;
  component?: (...args: any[]) => Promise<{
    readonly default: React.ComponentType<any>;
    readonly loader?: (context: RouteContext) => unknown;
  }>;
  validation?: Record<
    string,
    (value: string | undefined, context: RouteContext) => boolean
  >;
  element?: React.ElementType;
  guards?: Array<interfaces.ServiceIdentifier<RouteGuard>>;
  waitFor?: WaitForFunction;
  loader?: RouteLoaderFunction;
  children?: DefinedRoute[];
  shouldRevalidate?: ShouldRevalidateFunction;
  catchers?: Array<interfaces.ServiceIdentifier<Catcher>>;
  errorElement?: React.ReactNode;
  errorElementForChildren?: React.ReactNode;
  meta?: unknown;
}

export interface RouteContext {
  args: LoaderFunctionArgs;
  isInit: boolean;
}

export type RouteLoaderFunction = (context: RouteContext) => any | Promise<any>;

export type WaitForFunction = (context: RouteContext) => any | Promise<any>;

export type RouteGuard = {
  touch(context: RouteContext): any | Promise<any>;
};

export type Catcher = {
  catch(err: unknown, context: RouteContext): never;
};

export type RouteWithParams<K extends keyof RouterMap> =
  RouterMap[K]["params"] extends never
    ? [routeName: K]
    : [routeName: K, routeParams: RouterMap[K]["params"]];

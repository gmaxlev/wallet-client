import {
  Catcher,
  DefinedRoute,
  RouteContext,
  RouteGuard,
  RouteWithParams,
} from "./types";
import { Router } from "@remix-run/router";
import {
  createBrowserRouter,
  resolvePath,
  RouteObject,
} from "react-router-dom";
import React from "react";
import { action, makeObservable, observable } from "mobx";
import RouteContainer from "./components/RouteContainer";
import { Suspense } from "react";
import { container } from "../ioc/container";
import { injectable, interfaces } from "inversify";
import { ParentAwaitForException } from "./exeptions/ParentAwaitForException";
import { removePathTypes } from "./utils";
import { RouterMap } from "./generated/RouterMap";
import { generatePath } from "react-router";
interface RouteResolvedConfig {
  path: string;
  parent: RouteResolvedConfig | null;
  waitForPromise: Promise<unknown> | null;
}

@injectable()
export class RoutingService {
  public router!: Router;
  private activatedRoutes: string[] = [];
  private routerConfigs = new Map<string, RouteResolvedConfig>();
  private namesMap = new Map<string, string>();

  @observable loadings = 0;

  constructor(private readonly routes: DefinedRoute[]) {
    makeObservable(this);
  }

  init() {
    this.router = createBrowserRouter(
      this.defineRoutes(this.routes, [], "/", [], null)
    );
  }

  private defineRoutes(
    routes: DefinedRoute[],
    parents: DefinedRoute[],
    from: string,
    catchers: interfaces.ServiceIdentifier<Catcher>[],
    parentsErrorElement: React.ReactNode | null
  ) {
    return routes.map((route) =>
      this.defineRoute(
        route,
        [...parents],
        from,
        [...catchers],
        parentsErrorElement
      )
    );
  }

  private defineRoute(
    route: DefinedRoute,
    parents: DefinedRoute[],
    from: string,
    catchers: interfaces.ServiceIdentifier<Catcher>[],
    parentsErrorElement: React.ReactNode | null
  ): RouteObject {
    const resolvedPath = removePathTypes(
      route.path ? resolvePath(route.path, from).pathname : from
    );

    if (this.namesMap.has(route.name)) {
      throw new Error(`Route name ${route.name} has already existed`);
    }

    this.namesMap.set(route.name, resolvedPath);

    const RouteComponent = route.component
      ? React.lazy(route.component)
      : route.element
      ? route.element
      : null;

    const parent = parents.length ? parents[parents.length - 1] : null;

    this.routerConfigs.set(route.name, {
      path: resolvedPath,
      waitForPromise: null,
      parent: parent
        ? (this.routerConfigs.get(parent.name) as RouteResolvedConfig)
        : null,
    });

    const routeCatchers = [
      ...catchers,
      ...(route.catchers ? route.catchers : []),
    ];

    const errorElementForChildren = route.errorElementForChildren
      ? route.errorElementForChildren
      : null;

    const children = route.children
      ? this.defineRoutes(
          route.children,
          [...parents, route],
          resolvedPath,
          [...routeCatchers],
          errorElementForChildren
        )
      : [];

    const catchersHierarchy = routeCatchers.length
      ? this.createCatchHierarchy(routeCatchers)
      : null;

    const errorElement = route.errorElement
      ? route.errorElement
      : parentsErrorElement
      ? parentsErrorElement
      : null;

    return {
      id: route.name,
      ...(route.index ? { index: true } : { path: resolvedPath, children }),
      ...(errorElement && { errorElement }),
      ...(RouteComponent && {
        element: (
          <Suspense>
            <RouteContainer
              onMount={() => this.activateRoute(parents)}
              onDestroyed={() => this.exitRoute(parents)}
              key={route.name}
            >
              <RouteComponent />
            </RouteContainer>
          </Suspense>
        ),
      }),
      ...(route.shouldRevalidate
        ? route.shouldRevalidate
        : { shouldRevalidate: () => false }),
      loader: async (args) => {
        let context!: RouteContext;

        try {
          this.onStartLoading();

          const routeResolvedConfig = this.routerConfigs.get(
            route.name
          ) as RouteResolvedConfig;

          const isInit = !this.isRouteActivated(route.name);

          context = {
            args,
            isInit,
          };

          if (route.validation) {
            for (const validator in route.validation) {
              if (
                !route.validation[validator](args.params[validator], context)
              ) {
                throw new Error("Validation error");
              }
            }
          }

          /**
           * We want to wait for resolving our parent route Guards and waitFor function in the loader
           * because React Router runs all the loaders immediately,
           * so we get the reference to Promise of parent loader and waiting for resolving it
           */
          const parentWaitForPromise = routeResolvedConfig.parent
            ? routeResolvedConfig.parent.waitForPromise
            : null;

          const waitForPromise = new Promise(async (resolve, reject) => {
            try {
              if (parentWaitForPromise) {
                try {
                  await parentWaitForPromise;
                } catch (e: unknown) {
                  throw new ParentAwaitForException();
                }
              }
              if (route.guards) {
                for (const key of route.guards) {
                  await container.get<RouteGuard>(key).touch(context);
                }
              }
              if (route.waitFor) {
                await route.waitFor(context);
              }
            } catch (e) {
              reject(e);
            }

            resolve(true);
          });

          routeResolvedConfig.waitForPromise = waitForPromise;

          await routeResolvedConfig.waitForPromise;

          if (routeResolvedConfig.waitForPromise === waitForPromise) {
            routeResolvedConfig.waitForPromise = null;
          }

          if (route.loader) {
            await route.loader(context);
          }

          let loadedData = null;

          if (route.component) {
            const page = await route.component();
            if (page.loader) {
              loadedData = await page.loader(context);
              loadedData = loadedData === undefined ? null : loadedData;
            }
          }

          this.onStopLoading();
          return loadedData;
        } catch (e: unknown) {
          this.onStopLoading();
          if (e instanceof ParentAwaitForException) {
            return;
          }
          if (!catchersHierarchy) {
            throw e;
          }
          catchersHierarchy(e, context);
        }
      },
    };
  }

  @action
  private onStartLoading() {
    this.loadings += 1;
  }

  @action
  private onStopLoading() {
    this.loadings -= 1;
  }

  private createCatchHierarchy(
    items: Array<interfaces.ServiceIdentifier<Catcher>>,
    index = 0
  ) {
    return (enter: unknown, context: RouteContext) => {
      if (index === items.length - 1) {
        container.get<Catcher>(items[index]).catch(enter, context);
      } else {
        try {
          this.createCatchHierarchy(items, index + 1)(enter, context);
        } catch (e) {
          container.get<Catcher>(items[index]).catch(e, context);
        }
      }
    };
  }

  private isRouteActivated(routeName: string) {
    return this.activatedRoutes.includes(routeName);
  }

  private activateRoute(routes: DefinedRoute[]) {
    routes.forEach((route) => this.activatedRoutes.push(route.name));
  }

  private exitRoute(routes: DefinedRoute[]) {
    routes.forEach(
      (route) =>
        (this.activatedRoutes = this.activatedRoutes.filter(
          (item) => item !== route.name
        ))
    );
  }

  public generatePath<T extends keyof RouterMap>(...args: RouteWithParams<T>) {
    const [routeName, routeParams = {}] = args;
    return generatePath(
      this.namesMap.get(routeName) as string,
      routeParams as any
    );
  }
}

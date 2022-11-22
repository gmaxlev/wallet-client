import { DefinedRoute } from "../router/types";
import { AuthGuardService } from "../auth/guards/AuthGuardService";
import accountsRoutes from "./accounts/routes";
import { injectFn } from "../ioc/container";
import { I18nService } from "../i18n/I18nService";
import DefaultErrorElement from "../components/DefaultErrorElement/DefaultErrorElement";
import { UnauthorizedCatcher } from "../auth/catchers/UnauthorizedCatcher";
import categoriesRoutes from "./categories/routes";

const appRoutes: DefinedRoute[] = [
  {
    name: "app",
    path: "app",
    catchers: [UnauthorizedCatcher],
    guards: [AuthGuardService],
    waitFor: injectFn(
      [I18nService],
      (i18nService: I18nService) => () =>
        i18nService.load("app", {
          uk: import("./locales/uk.json"),
        })
    ),
    component: () => import("./layouts/AppLayout/AppLayout"),
    errorElement: <DefaultErrorElement />,
    errorElementForChildren: <DefaultErrorElement />,
    children: [
      {
        index: true,
        name: "app-home",
        component: () => import("./pages/AppHomePage"),
      },
      ...accountsRoutes,
      ...categoriesRoutes,
    ],
  },
];

export default appRoutes;

import { DefinedRoute } from "../router/types";
import { GuestGuardService } from "./guards/GuestGuardService";
import { injectFn } from "../ioc/container";
import { I18nService } from "../i18n/I18nService";
import { AuthGuardService } from "./guards/AuthGuardService";
import LogoutPage from "./pages/LogoutPage";
import DefaultErrorElement from "../components/DefaultErrorElement/DefaultErrorElement";

const localesLoader = injectFn(
  [I18nService],
  (i18nService: I18nService) => () =>
    i18nService.load("auth", {
      uk: import("./locales/uk.json"),
    })
);

const authRoutes: DefinedRoute[] = [
  {
    name: "auth",
    path: "auth",
    errorElementForChildren: <DefaultErrorElement />,
    children: [
      {
        name: "sign-in",
        path: "sign-in",
        waitFor: localesLoader,
        guards: [GuestGuardService],
        component: () => import("./pages/SignInPage"),
      },
      {
        name: "sign-up",
        path: "sign-up",
        waitFor: localesLoader,
        guards: [GuestGuardService],
        component: () => import("./pages/SignUpPage"),
      },
      {
        name: "logout",
        path: "logout",
        guards: [AuthGuardService],
        element: LogoutPage,
      },
    ],
  },
];

export default authRoutes;

import { Suspense } from "react";
import React from "react";
import auth from "../auth/services/auth";
import { redirect } from "react-router-dom";
import i18next from "../i18n";

const AppLayout = React.lazy(() => import("./layouts/AppLayout/AppLayout"));
const AppHomePage = React.lazy(() => import("./pages/AppHomePage"));
const SettingsPage = React.lazy(() => import("./pages/SettingsPage"));

export const appRoutes = [
  {
    path: "/app",
    async loader() {
      if (!auth.isLogin) {
        return redirect("/auth/sign-in");
      }
      const uk = await import("./locales/uk.json");
      return i18next.addResourceBundle("uk", "app", uk.default);
    },
    element: (
      <Suspense>
        <AppLayout />
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense>
            <AppHomePage />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
];

import i18next from "../i18n";
import { Suspense } from "react";
import React from "react";
import auth from "./services/auth";
import { redirect } from "react-router-dom";

const SignInPage = React.lazy(() => import("./pages/SignInPage"));
const SignUpPage = React.lazy(() => import("./pages/SignUpPage"));

export const authRoutes = [
  {
    path: "/auth",
    async loader() {
      if (auth.isLogin) {
        return redirect("/app");
      }
      const uk = await import("./locales/uk.json");
      return i18next.addResourceBundle("uk", "auth", uk.default);
    },
    children: [
      {
        path: "sign-in",
        element: (
          <Suspense>
            <SignInPage />
          </Suspense>
        ),
      },
      {
        path: "sign-up",
        element: (
          <Suspense>
            <SignUpPage />
          </Suspense>
        ),
      },
    ],
  },
];

import SignInPage from "./pages/SignInPage";
import i18next from "../i18n";
import uk from "./locales/uk.json";
import SignUpPage from "./pages/SignUpPage";

export const authRoutes = [
  {
    path: "/auth",
    loader() {
      return i18next.addResourceBundle("uk", "auth", uk);
    },
    children: [
      {
        path: "sign-in",
        element: <SignInPage />,
      },
      {
        path: "sign-up",
        element: <SignUpPage />,
      },
    ],
  },
];

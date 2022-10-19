import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "../auth/routes";
import { homeRoutes } from "../home/routes";
import { appRoutes } from "../app/routes";

export const router = createBrowserRouter([
  ...authRoutes,
  ...homeRoutes,
  ...appRoutes,
]);

import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "../auth/routes";
import { homeRoutes } from "../home/routes";

export const router = createBrowserRouter([...authRoutes, ...homeRoutes]);

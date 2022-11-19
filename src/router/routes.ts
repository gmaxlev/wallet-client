import authRoutes from "../auth/routes";
import appRoutes from "../app/routes";

const routes = [...authRoutes, ...appRoutes];

export default routes;

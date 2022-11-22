import { DefinedRoute } from "../../router/types";
import { isPositiveIntParam } from "../../router/utils";

const categoriesRoutes: DefinedRoute[] = [
  {
    name: "categories",
    path: "categories",
    children: [
      {
        index: true,
        name: "categories-index",
        component: () => import("./pages/CategoriesPage"),
      },
      {
        path: "create",
        name: "categories-create",
        component: () => import("./pages/CategoriesCreatePage"),
      },
      {
        path: "edit/:id",
        name: "categories-edit",
        validation: {
          id: isPositiveIntParam,
        },
        component: () => import("./pages/CategoriesEditPage"),
      },
    ],
  },
];

export default categoriesRoutes;

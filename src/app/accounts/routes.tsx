import { DefinedRoute } from "../../router/types";
import { isPositiveIntParam } from "../../router/utils";

const accountsRoutes: DefinedRoute[] = [
  {
    name: "accounts",
    path: "accounts",
    children: [
      {
        index: true,
        name: "accounts-index",
        component: () => import("./pages/AccountsPage"),
      },
      {
        path: "create",
        name: "accounts-create",
        component: () => import("./pages/AccountCreatePage"),
      },
      {
        path: "edit/:id[number]",
        validation: {
          id: isPositiveIntParam,
        },
        name: "accounts-edit",
        component: () => import("./pages/AccountEditPage"),
      },
    ],
  },
];

export default accountsRoutes;

import React, { Suspense } from "react";

const HomePage = React.lazy(() => import("./pages/HomePage"));

export const homeRoutes = [
  {
    path: "/",
    element: (
      <Suspense>
        <HomePage />
      </Suspense>
    ),
  },
];

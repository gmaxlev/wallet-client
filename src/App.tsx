import { RouterProvider } from "react-router-dom";
import React, { useEffect, useState } from "react";
import auth from "./auth/services/auth";

export default function App() {
  const [routes, setRoutes] = useState<any>(null);

  useEffect(() => {
    auth
      .restore()
      .catch(() => {})
      .then(() => {
        return import("./router");
      })
      .then((module) => {
        setRoutes(module.router);
      });
  }, []);

  return <>{routes ? <RouterProvider router={routes} /> : null}</>;
}

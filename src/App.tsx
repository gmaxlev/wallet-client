import { CssBaseline } from "@mui/material";
import { container, iOcContext, useInject } from "./ioc/container";
import { RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { RoutingService } from "./router/RoutingService";

interface Props {
  initializer: Promise<unknown>;
}

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function App(props: Props) {
  const [ready, setReady] = useState(false);
  const routingService = useInject<RoutingService>(RoutingService);

  useEffect(() => {
    props.initializer.then(() => setReady(true));
    // eslint-disable-next-line
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {ready && (
        <iOcContext.Provider value={container}>
          <RouterProvider router={routingService.router} />
        </iOcContext.Provider>
      )}
    </ThemeProvider>
  );
}

import reportWebVitals from "./reportWebVitals";
import ReactDOM from "react-dom/client";
import { container, getProviderKey } from "./ioc/container";
import configDev from "./config/config.dev";
import { RoutingService } from "./router/RoutingService";
import routes from "./router/routes";
import React from "react";
import { I18nService } from "./i18n/I18nService";
import uk from "./locales/uk.json";
import App from "./App";
import { AXIOS_PROVIDER, CONFIG_PROVIDER } from "./providers";
import axios from "axios";

container.bind(getProviderKey(CONFIG_PROVIDER)).toConstantValue(configDev);
container.bind(getProviderKey(AXIOS_PROVIDER)).toConstantValue(axios);

const i18nService = new I18nService(
  { uk },
  configDev.i18n.fallbackLng,
  configDev.i18n.fallbackLng
);

container.bind(I18nService).toConstantValue(i18nService);

const routingService = new RoutingService(routes);
container.bind(RoutingService).toConstantValue(routingService);
routingService.init();

const initializer = i18nService.init();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App initializer={initializer} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

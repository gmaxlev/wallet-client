import { ConfigType } from "../types";

const configDev: ConfigType = {
  api: {
    host: "http://192.168.100.87:3000/",
    refreshTokenUrl: "/auth/refresh",
  },
  i18n: {
    fallbackLng: "en",
  },
};

export default configDev;

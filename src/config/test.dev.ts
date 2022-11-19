import { ConfigType } from "../types";

const configTest: ConfigType = {
  api: {
    host: "http://192.168.100.87:3000/",
    refreshTokenUrl: "/auth/refresh",
  },
  i18n: {
    fallbackLng: "en",
  },
};

export default configTest;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import uk from "./common/uk.json";

const resources = {
  uk: {
    common: uk,
  },
};

const i18nInstance = i18n.use(initReactI18next).use(LanguageDetector);

i18nInstance.init({
  resources,
  defaultNS: "common",
  lng: "uk",
  fallbackLng: "uk",
  interpolation: {
    escapeValue: false,
  },
});

export default i18nInstance;

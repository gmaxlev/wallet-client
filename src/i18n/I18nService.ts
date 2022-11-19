import i18n from "i18next";
import type { Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export class I18nService {
  i18n: typeof i18n;
  commonResources: Resource;
  constructor(commonResources: Resource, lng: string, fallbackLng: string) {
    this.commonResources = commonResources;
    this.i18n = i18n.use(initReactI18next).use(LanguageDetector);
  }
  init() {
    return this.i18n.init({
      resources: this.commonResources,
      defaultNS: "common",
      lng: "uk",
      fallbackLng: "uk",
      interpolation: {
        escapeValue: true,
      },
    });
  }
  async load(
    ns: string,
    resources: Record<string, Promise<{ default: unknown }>>
  ) {
    const loaded = await Promise.all(Object.values(resources));
    const languages = Object.keys(resources);
    for (const [index, lng] of languages.entries()) {
      await this.i18n.addResourceBundle(lng, ns, loaded[index].default);
    }
  }
}

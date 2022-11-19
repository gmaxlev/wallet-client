// @ts-nocheck
import routes from "../routes";
import { DefinedRoute } from "../types";
import { parseParams } from "../utils";
import * as path from "path";
import * as fsp from "fs/promises";

const roteInterfaceKeys: string[] = [];

(function handleRoutes(routes: DefinedRoute[]) {
  routes.forEach((route) => {
    if (route.path) {
      let params = "never";
      const list = parseParams(route.path);

      if (Object.keys(list).length > 0) {
        params = "{ ";
        for (const key in list) {
          params += `${key}: ${list[key]}, `;
        }
        params += "}";
      }
      roteInterfaceKeys.push(`"${route.name}": { params: ${params} }`);
    }
    if (route.children) {
      handleRoutes(route.children);
    }
  });
})(routes);

let fileContent = `export interface RouterMap { ${roteInterfaceKeys.join(
  ", "
)} }`;

(async (fileContent: string) => {
  await fsp.writeFile(path.join(__dirname, "RouterMap.ts"), fileContent);
})(fileContent);

export {};

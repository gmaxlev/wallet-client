import { defineProvider } from "./ioc/container";
import { ConfigType } from "./types";
import axios from "axios";

export const CONFIG_PROVIDER = defineProvider<ConfigType>("CONFIG_PROVIDER");
export const AXIOS_PROVIDER = defineProvider<typeof axios>("AXIOS_PROVIDER");

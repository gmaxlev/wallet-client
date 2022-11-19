import { ApiService } from "./ApiService";
import { AXIOS_PROVIDER, CONFIG_PROVIDER } from "../providers";
import { getProviderKey } from "../ioc/container";
import * as inversify from "inversify";
import configTest from "../config/test.dev";
import axios, { AxiosResponse } from "axios";
import MockAdapter from "axios-mock-adapter";

describe("ApiService.js", () => {
  let container = new inversify.Container();

  container.bind(ApiService).toSelf();
  container.bind(getProviderKey(CONFIG_PROVIDER)).toConstantValue(configTest);
  container.bind(getProviderKey(AXIOS_PROVIDER)).toConstantValue(axios);

  new MockAdapter(axios);

  describe("Update JWT token", () => {
    let axiosMock!: MockAdapter;

    let reply201 = jest.fn(() => [201]);
    let reply401 = jest.fn(() => [401]);
    let reply200 = jest.fn(() => [200]);

    beforeEach(() => {
      axiosMock = new MockAdapter(axios);
      reply201 = jest.fn(() => [201]);
      reply401 = jest.fn(() => [401]);
      reply200 = jest.fn(() => [200]);
    });
    afterEach(() => {
      axiosMock.reset();
    });

    test("Should make a request for updating token", async () => {
      const apiService = container.get(ApiService);

      axiosMock.onPost(configTest.api.refreshTokenUrl).replyOnce(reply201);

      axiosMock
        .onGet("/user")
        .replyOnce(reply200)
        .onGet("/user")
        .replyOnce(reply200);

      const { status } = await apiService.resources.user.get();

      expect(reply201).toHaveBeenCalledTimes(0);
      expect(reply401).toHaveBeenCalledTimes(0);
      expect(reply200).toHaveBeenCalledTimes(1);
      expect(status).toBe(200);
    });

    test("401 -> 201 -> 200", async () => {
      const apiService = container.get(ApiService);

      axiosMock.onPost(configTest.api.refreshTokenUrl).replyOnce(reply201);

      axiosMock
        .onGet("/user")
        .replyOnce(reply401)
        .onGet("/user")
        .replyOnce(reply200);

      const { status } = await apiService.resources.user.get();

      expect(reply201).toHaveBeenCalledTimes(1);
      expect(reply401).toHaveBeenCalledTimes(1);
      expect(reply200).toHaveBeenCalledTimes(1);
      expect(status).toBe(200);
    });

    test("401 -> 401", async () => {
      const apiService = container.get(ApiService);

      expect.assertions(3);

      axiosMock.onPost(configTest.api.refreshTokenUrl).replyOnce(reply401);

      axiosMock
        .onGet("/user")
        .replyOnce(reply401)
        .onGet("/user")
        .replyOnce(reply401);

      try {
        await apiService.resources.user.get();
      } catch (e) {
      } finally {
        expect(reply401).toHaveBeenCalledTimes(2);
        expect(reply200).toHaveBeenCalledTimes(0);
        expect(reply201).toHaveBeenCalledTimes(0);
      }
    });

    test("Accumulate", async () => {
      const apiService = container.get(ApiService);

      expect.assertions(6);

      axiosMock.onPost(configTest.api.refreshTokenUrl).replyOnce(reply201);

      axiosMock
        .onGet("/user")
        .replyOnce(reply401)
        .onGet("/user")
        .replyOnce(reply401)
        .onGet("/user")
        .replyOnce(reply401)
        .onGet("/user")
        .replyOnce(reply200)
        .onGet("/user")
        .replyOnce(reply200)
        .onGet("/user")
        .replyOnce(reply200);

      let response!: [
        AxiosResponse<unknown>,
        AxiosResponse<unknown>,
        AxiosResponse<unknown>
      ];

      try {
        response = await Promise.all([
          apiService.resources.user.get(),
          apiService.resources.user.get(),
          apiService.resources.user.get(),
        ]);
      } catch (e) {
      } finally {
        expect(reply401).toHaveBeenCalledTimes(3);
        expect(reply200).toHaveBeenCalledTimes(3);

        // Must be called only ONE time
        expect(reply201).toHaveBeenCalledTimes(1);

        expect(response[0].status).toBe(200);
        expect(response[1].status).toBe(200);
        expect(response[2].status).toBe(200);
      }
    });
  });
});

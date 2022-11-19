import { parseParams, removePathTypes } from "./utils";

describe("utils.spec.ts", () => {
  describe("parseParams()", () => {
    describe.each`
      input                                          | output
      ${""}                                          | ${{}}
      ${"/"}                                         | ${{}}
      ${"/app/categories"}                           | ${{}}
      ${"/app/categories/:slug[string]"}             | ${{ slug: "string" }}
      ${"/app/categories/:id"}                       | ${{ id: "unknown" }}
      ${"/app/categories/-entity:id"}                | ${{ id: "unknown" }}
      ${"/app/categories/:id[string]"}               | ${{ id: "string" }}
      ${"/app/categories/entity-:id[number]"}        | ${{ id: "number" }}
      ${"/app/categories/:id/:some"}                 | ${{ id: "unknown", some: "unknown" }}
      ${"/app/categories/:id[number]/:some[string]"} | ${{ id: "number", some: "string" }}
    `("$input - $output", ({ input, output }) => {
      test(`Must return ${JSON.stringify(output)}`, () => {
        expect(parseParams(input)).toEqual(output);
      });
    });
  });
  describe("removePathTypes()", () => {
    describe.each`
      input                                          | output
      ${""}                                          | ${""}
      ${"/"}                                         | ${"/"}
      ${"/app/some/path"}                            | ${"/app/some/path"}
      ${"/app/some/path/:id"}                        | ${"/app/some/path/:id"}
      ${"/app/some/path/:id[number]"}                | ${"/app/some/path/:id"}
      ${"/app/some/path/:id[number]/other"}          | ${"/app/some/path/:id/other"}
      ${"/app/some/path/:id[number]/:param"}         | ${"/app/some/path/:id/:param"}
      ${"/app/some/path/:id[number]/:param[string]"} | ${"/app/some/path/:id/:param"}
    `(`$input - $output`, ({ input, output }) => {
      test(`Must return ${JSON.stringify(output)}`, () => {
        expect(removePathTypes(input)).toEqual(output);
      });
    });
  });
});

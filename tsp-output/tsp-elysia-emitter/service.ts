import { Elysia, Static } from "elsyia";
import * as models from "./models.js";

export type PetsRoutes = {
  pets: {
    get: {
      body: unknown;
      params: {};
      query: { filter: Static<typeof models.petType> };
      headers: unknown;
      response: unknown;
    };
    testing: {
      body: unknown;
      params: {};
      query: unknown;
      headers: unknown;
      response: unknown;
    };
  };
};

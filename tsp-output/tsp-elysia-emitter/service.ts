import { Elysia, Static } from "elsyia";
import * as models from "./models.js";

export type PetsRoutes = {
  pets: {
    get: {
      body: { readonly 200: unknown };
      params: {};
      query: { filter: Static<typeof models.petType> };
      headers: unknown;
      response: unknown;
    };
    testing: {
      body: { readonly 200: unknown; readonly 404: unknown };
      params: { petId: string };
      query: unknown;
      headers: unknown;
      response: unknown;
    };
  };
};

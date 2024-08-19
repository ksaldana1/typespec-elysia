import { Elysia, Static } from "elsyia";
import * as models from "./models.js";

export type PetsRoutes = {
  pets: {
    get: {
      body: unknown;
      params: {};
      query: { filter: Static<typeof models.petType>; after: string };
      headers: unknown;
      response: { readonly 200: Array<Static<typeof models.Pet>> };
    };
    testing: {
      body: unknown;
      params: { petId: string };
      query: unknown;
      headers: unknown;
      response: {
        readonly 200: Static<typeof models.Pet>;
        readonly 404: string;
      };
    };
  };
};

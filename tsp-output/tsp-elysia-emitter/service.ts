import { Elysia, Static } from "elsyia";
import * as models from "./models.js";

export type PetsRoutes = {
  pets: {
    get: {
      body: unknown;
      params: {};
      query: { filter: Static<typeof models.petType> };
      headers: unknown;
      response: { readonly 200: Array<Static<typeof models.Pet>> };
    };
    ":petId": {
      get: {
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
    type: {
      ":type": {
        get: {
          body: unknown;
          params: { type: string };
          query: unknown;
          headers: unknown;
          response: { readonly 200: Array<Static<typeof models.Pet>> };
        };
      };
    };
  };
};

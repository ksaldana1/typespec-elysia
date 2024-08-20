import { Elysia, Static } from "elysia";
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
    post: {
      body: { pet: Static<typeof models.Pet> };
      params: {};
      query: unknown;
      headers: unknown;
      response: { readonly 201: Static<typeof models.Pet> };
    };
  };
};

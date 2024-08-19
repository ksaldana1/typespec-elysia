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
      response: { readonly 200: unknown; readonly 404: unknown };
    };
  };
};

export type TodosRoutes = {
  todos: {
    get: {
      body: unknown;
      params: {};
      query: unknown;
      headers: unknown;
      response: { readonly 200: Array<Static<typeof models.Todo>> };
    };
    testing: {
      body: unknown;
      params: { todoId: string };
      query: unknown;
      headers: unknown;
      response: { readonly 200: unknown; readonly 404: unknown };
    };
  };
};

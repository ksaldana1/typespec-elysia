import { Elysia, type RouteBase, type Static } from "elysia";
import { type SimplifyDeep } from "type-fest";
import * as models from "../tsp-output/tsp-elysia-emitter/models.js";

export type Service<Routes extends RouteBase> = Elysia<
  "",
  false,
  {
    decorator: any;
    store: any;
    derive: any;
    resolve: any;
  },
  {
    type: any;
    error: any;
  },
  { schema: any; macro: any; macroFn: any },
  SimplifyDeep<Routes>,
  {
    derive: any;
    resolve: any;
    schema: any;
  },
  {
    derive: any;
    resolve: any;
    schema: any;
  }
>;

export type TodoRoutes = {
  todos: {
    get: {
      body: unknown;
      params: {};
      query: unknown;
      headers: unknown;
      response: {
        200: Array<Static<typeof models.Todo>>;
      };
    };
    ":todoId": {
      get: {
        body: unknown;
        params: {
          todoId: string;
        };
        query: unknown;
        headers: unknown;
        response: {
          readonly 200: Static<typeof models.Todo>;
          readonly 404: string;
        };
      };
    };
  };
};

export type TodoService = Service<TodoRoutes>;

export type PetRoutes = {
  pets: {
    get: {
      body: unknown;
      params: {};
      query: {
        filter?: "cat" | "dog" | "fish" | "bird" | "reptile";
      };
      headers: unknown;
      response: {
        readonly 200: {
          name: string;
          id: number;
          age: number;
          kind: "cat" | "dog" | "fish" | "bird" | "reptile";
        }[];
      };
    };
    ":petId": {
      get: {
        body: unknown;
        params: {
          petId: string;
        };
        query: unknown;
        headers: unknown;
        response: {
          readonly 200: {
            name: string;
            id: number;
            age: number;
            kind: "cat" | "dog" | "fish" | "bird" | "reptile";
          };
          readonly 404: string;
        };
      };
    };
  };
};

export type PetService = Service<PetRoutes>;

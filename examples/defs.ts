import {
  Elysia,
  type DefinitionBase,
  type RouteBase,
  type Static,
} from "elysia";
import { Todo } from "../tsp-output/tsp-elysia-emitter/models.js";
import { type SimplifyDeep } from "type-fest";
import * as models from "../tsp-output/tsp-elysia-emitter/models.js";

export type Service<
  Definitions extends DefinitionBase["type"],
  Routes extends RouteBase,
> = Elysia<
  "",
  false,
  {
    decorator: any;
    store: any;
    derive: any;
    resolve: any;
  },
  {
    type: SimplifyDeep<Definitions>;
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

export type TodoModels = {
  Todo: Static<typeof Todo>;
  Todos: Array<Static<typeof Todo>>;
};

export type TodoRoutes = {
  todos: {
    get: {
      body: unknown;
      params: {};
      query: unknown;
      headers: unknown;
      response: {
        200: TodoModels["Todos"];
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
          readonly 200: TodoModels["Todo"];
          readonly 404: string;
        };
      };
    };
  };
};

export type TodoService = Service<TodoModels, TodoRoutes>;

type PetModels = {
  petType: Static<typeof models.petType>;
  Pet: Static<typeof models.Pet>;
  Pets: Array<Static<typeof models.Pet>>;
};

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

export type PetService = Service<PetModels, PetRoutes>;

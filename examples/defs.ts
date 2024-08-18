import { Elysia, type Static } from "elysia";
import { Todo } from "../tsp-output/tsp-elysia-emitter/models.js";
import { type SimplifyDeep } from "type-fest";
import * as models from "../tsp-output/tsp-elysia-emitter/models.js";

export type Definition = {
  Todo: Static<typeof Todo>;
  Todos: Array<Static<typeof Todo>>;
};

type Routes = {
  todos: {
    get: {
      body: unknown;
      params: {};
      query: unknown;
      headers: unknown;
      response: {
        200: Definition["Todos"];
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
          readonly 200: Definition["Todo"];
          readonly 404: string;
        };
      };
    };
  };
};

export type TodoServer = Elysia<
  "",
  false,
  {
    decorator: any;
    store: any;
    derive: any;
    resolve: any;
  },
  {
    type: SimplifyDeep<Definition>;
    error: {};
  },
  {
    schema: any;
    macro: any;
    macroFn: any;
  },
  SimplifyDeep<Routes>,
  {
    derive: {};
    resolve: {};
    schema: {};
  },
  {
    derive: {};
    resolve: {};
    schema: {};
  }
>;

type PetDefinitions = {
  petType: Static<typeof models.petType>;
  Pet: Static<typeof models.Pet>;
  Pets: Array<Static<typeof models.Pet>>;
};

export type PetServer = Elysia<
  "",
  false,
  {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
  },
  {
    type: SimplifyDeep<PetDefinitions>;
    error: {};
  },
  {
    schema: {};
    macro: {};
    macroFn: {};
  },
  {
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
    };
  } & {
    pets: {
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
  },
  {
    derive: {};
    resolve: {};
    schema: {};
  },
  {
    derive: {};
    resolve: {};
    schema: {};
  }
>;

import { Elysia } from "elysia";

export type TodoServer = Elysia<
  "",
  false,
  {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
  },
  {
    type: {
      readonly Todo: {
        id: number;
        text: string;
        completed: boolean;
      };
      readonly Todos: {
        id: number;
        text: string;
        completed: boolean;
      }[];
    };
    error: {};
  },
  {
    schema: {};
    macro: {};
    macroFn: {};
  },
  {
    todos: {
      get: {
        body: unknown;
        params: {};
        query: unknown;
        headers: unknown;
        response: {
          200: {
            id: number;
            text: string;
            completed: boolean;
          }[];
        };
      };
    };
  } & {
    todos: {
      ":todoId": {
        get: {
          body: unknown;
          params: {
            todoId: string;
          };
          query: unknown;
          headers: unknown;
          response: {
            readonly 200: {
              id: number;
              text: string;
              completed: boolean;
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
    type: {
      readonly petType: "cat" | "dog" | "fish" | "bird" | "reptile";
      readonly Pet: {
        name: string;
        id: number;
        age: number;
        kind: "cat" | "dog" | "fish" | "bird" | "reptile";
      };
      readonly Pets: {
        name: string;
        id: number;
        age: number;
        kind: "cat" | "dog" | "fish" | "bird" | "reptile";
      }[];
    };
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

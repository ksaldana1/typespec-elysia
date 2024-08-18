import { Elysia, Static } from "elsyia";
import * as models from "./models";

export type TodosRoutes = {
  todos: {
    get: {
      listTodos: string;
    };
    getTodo: {
      getTodo: string;
    };
  };
};

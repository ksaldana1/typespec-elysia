import { Elysia, t, type Static } from "elysia";
import { TodosRoutes } from "../tsp-output/tsp-elysia-emitter/service.js";
import { Service } from "./defs.js";
import * as models from "../tsp-output/tsp-elysia-emitter/models.js";

const _db: Record<string, Static<typeof models.Todo>> = {
  "1": {
    id: 1,
    text: "Do laundry",
    completed: false,
  },
  "2": {
    id: 2,
    text: "Buy groceries",
    completed: true,
  },
};

export default new Elysia({ name: "Todo Store" })
  .decorate("db", _db)
  .model({
    Todo: models.Todo,
    Todos: t.Array(models.Todo),
  })
  .get("/todos", ({ db }) => {
    return Object.values(db);
  })
  .get("/todos/:todoId", ({ params, error, db }) => {
    const todo = db[params.todoId];
    if (!todo) {
      return error(404, "Not found");
    }
    return todo;
  }) satisfies Service<TodosRoutes>;

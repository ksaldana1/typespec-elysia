import { Elysia, t, type Static } from "elysia";
import { type TodoService } from "./defs.js";

const Todo = t.Object({
  id: t.Integer(),
  text: t.String({ minLength: 1 }),
  completed: t.Boolean(),
});

const Todos = t.Array(Todo);

const _db: Record<string, Static<typeof Todo>> = {
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
  .model({
    Todo,
    Todos,
  })
  .get("/todos", () => {
    return Object.values(_db);
  })
  .get("/todos/:todoId", ({ params, error }) => {
    const todo = _db[params.todoId];
    if (!todo) {
      return error(404, "Not found");
    }
    return todo;
  }) satisfies TodoService;

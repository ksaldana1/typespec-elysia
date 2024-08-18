import TodoServer from "../examples/todos.js";
import { expect, it, describe } from "vitest";

describe("TodoServer", () => {
  it("/todos returns todos", async () => {
    const response = await TodoServer.handle(
      new Request("http://localhost/todos"),
    );
    const todos = await response.json();
    expect(todos).not.toBeFalsy();
  });
  it("/todos/:todoId returns todo if exists", async () => {
    const response = await TodoServer.handle(
      new Request("http://localhost/todos/1"),
    );
    const todo = await response.json();
    expect(todo).not.toBeFalsy();
  });
  it("/todos/:todoId throws 404 if todo does not exist", async () => {
    const response = await TodoServer.handle(
      new Request("http://localhost/todos/999999"),
    );
    expect(response.status).toBe(404);
  });
});

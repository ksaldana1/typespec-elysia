import { TodoService, PetService, Gateway } from "./defs.js";
import petServer from "./pets.js";
import todoServer from "./todos.js";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { treaty } from "@elysiajs/eden";

export const app = new Elysia()
  .use(cors())
  .use(petServer)
  .use(todoServer) satisfies Gateway<[PetService, TodoService]>;

// typesafe http client driven by same types
export const client = treaty<Gateway<[PetService, TodoService]>>(
  "http://localhost:3000",
);

const { data, error } = await client.pets({ petId: "123" }).get();

import { type PetService, type TodoService } from "./defs.js";
import petServer from "./pets.js";
import todoServer from "./todos.js";
import { Elysia } from "elysia";
import { type UnionToIntersection } from "type-fest";
import { cors } from "@elysiajs/cors";
import { treaty } from "@elysiajs/eden";

export const app = new Elysia()
  .use(cors())
  .use(petServer)
  .use(todoServer) satisfies Gateway<[PetService, TodoService]>;

type GatewaySchema<T extends Array<Elysia<any, any, any, any>>> = {
  [K in keyof T]: {
    routes: T[K]["_routes"];
  };
};

type Routes<T extends Array<Elysia<any, any, any, any>>> = UnionToIntersection<
  GatewaySchema<T>[number]["routes"]
>;

type Gateway<T extends Array<Elysia<any, any, any, any>>> = Elysia<
  "",
  false,
  any,
  any,
  any,
  Routes<T>
>;

export const client = treaty<Gateway<[PetService, TodoService]>>(
  "http://localhost:3000",
);

const { data, error } = await client.pets({ petId: "123" }).get();

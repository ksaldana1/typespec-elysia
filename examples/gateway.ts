import { type PetServer, type TodoServer } from "./defs.js";
import { server as petServer } from "./pets.js";
import { server as todoServer } from "./todos.js";
import { Elysia } from "elysia";
import { type UnionToIntersection } from "type-fest";
import { cors } from "@elysiajs/cors";
import { logger } from "@bogeychan/elysia-logger";
import { treaty } from "@elysiajs/eden";

export const app = new Elysia()
  .use(petServer)
  .use(todoServer) satisfies Gateway<[PetServer, TodoServer]>;

type GatewaySchema<T extends Array<Elysia<any, any, any, any>>> = {
  [K in keyof T]: {
    definitions: T[K]["_types"]["Definitions"];
    routes: T[K]["_routes"];
  };
};

type Definitions<T extends Array<Elysia<any, any, any, any>>> =
  UnionToIntersection<GatewaySchema<T>[number]["definitions"]>;

type Routes<T extends Array<Elysia<any, any, any, any>>> = UnionToIntersection<
  GatewaySchema<T>[number]["routes"]
>;

type Gateway<T extends Array<Elysia<any, any, any, any>>> = Elysia<
  "",
  false,
  any,
  Definitions<T>,
  any,
  Routes<T>
>;

export const client = treaty<Gateway<[PetServer, TodoServer]>>(
  "http://localhost:3000",
);

const { data, error } = await client.pets.get({ query: { filter: "cat" } });

import { PetServer, TodoServer } from "./defs";
import { server as petServer } from "./pets";
import { server as todoServer } from "./todos";
import { Elysia } from "elysia";
import { UnionToIntersection } from "type-fest";

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
  { decorator: {}; derive: {}; resolve: {}; store: {} },
  Definitions<T>,
  { macro: {}; macroFn: {}; schema: {} },
  Routes<T>
>;

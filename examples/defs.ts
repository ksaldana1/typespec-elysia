import { Elysia, type RouteBase } from "elysia";
import { type UnionToIntersection, type SimplifyDeep } from "type-fest";
import {
  type TodosRoutes,
  type PetsRoutes,
} from "../tsp-output/tsp-elysia-emitter/service.js";

export type Service<Routes extends RouteBase> = Elysia<
  "",
  false,
  {
    decorator: any;
    store: any;
    derive: any;
    resolve: any;
  },
  {
    type: any;
    error: any;
  },
  { schema: any; macro: any; macroFn: any },
  SimplifyDeep<Routes>,
  {
    derive: any;
    resolve: any;
    schema: any;
  },
  {
    derive: any;
    resolve: any;
    schema: any;
  }
>;

type GatewaySchema<T extends Array<Elysia<any, any, any, any>>> = {
  [K in keyof T]: {
    routes: T[K]["_routes"];
  };
};

type Routes<T extends Array<Elysia<any, any, any, any>>> = UnionToIntersection<
  GatewaySchema<T>[number]["routes"]
>;

export type Gateway<T extends Array<Elysia<any, any, any, any>>> = Elysia<
  "",
  false,
  any,
  any,
  any,
  Routes<T>
>;

export type PetService = Service<PetsRoutes>;

export type TodoService = Service<TodosRoutes>;

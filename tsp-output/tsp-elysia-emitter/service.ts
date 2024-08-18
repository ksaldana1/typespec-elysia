import {Elysia, Static} from 'elsyia';
import * as models from './models';

export type TodosRoutes = {
  todos: {
    get: {
      body: unknown
      params: {}
      query: unknown
      headers: unknown
      response: unknown
    }
    ;testing: {
      body: unknown
      params: {}
      query: unknown
      headers: unknown
      response: unknown
    }
    ;
  }
};


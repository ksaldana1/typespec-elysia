import { Elysia, t, type Static } from "elysia";
import { PetsRoutes } from "../tsp-output/tsp-elysia-emitter/service.js";
import { Service } from "./defs.js";
import * as models from "../tsp-output/tsp-elysia-emitter/models.js";

const _db: Record<string, Static<typeof models.Pet>> = {
  "1": {
    id: 1,
    name: "Garfield",
    age: 46,
    kind: "cat",
  },
  "2": {
    id: 2,
    name: "Scooby-Doo",
    age: 55,
    kind: "dog",
  },
};

export default new Elysia({ name: "Pet Store" })
  .decorate("db", _db)
  .model({
    petType: models.petType,
    Pet: models.Pet,
  })
  .get(
    "/pets",
    ({ db }) => {
      return Object.values(db);
    },
    { query: t.Object({ filter: models.petType }) },
  )
  .get("/pets/:petId", ({ params, error, db }) => {
    const pet = db[params.petId];
    if (!pet) {
      return error(404, "Not found");
    }
    return pet;
  })
  .post(
    "/pets",
    ({ body, error }) => {
      // would be nice to have a success wrapper this reads awful
      //return error(201, body.pet);
    },
    {
      body: t.Object({ pet: models.Pet }),
      headers: t.Object({ "request-id": t.String() }),
    },
  ) satisfies Service<PetsRoutes>;

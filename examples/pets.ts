import { Elysia, t, Static } from "elysia";
import { PetServer } from "./defs";

const petType = t.Union([
  t.Literal("dog"),
  t.Literal("cat"),
  t.Literal("fish"),
  t.Literal("bird"),
  t.Literal("reptile"),
]);

const Pet = t.Object({
  id: t.Integer(),
  name: t.String({ minLength: 1 }),
  age: t.Integer({ minimum: 0, maximum: 100 }),
  kind: petType,
});

const Pets = t.Array(Pet);

const _db: Record<string, Static<typeof Pet>> = {
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

export const server = new Elysia({ name: "Pet Store" })
  .model({
    petType,
    Pet,
    Pets,
  })
  .get(
    "/pets",
    () => {
      return Object.values(_db);
    },
    { response: "Pets", query: t.Object({ filter: t.Optional(petType) }) },
  )
  .get(
    "/pets/:petId",
    ({ params, error }) => {
      error("Not Found", "Not found");
      return _db[params.petId];
    },
    {
      response: {
        200: "Pet",
        404: t.String(),
      },
    },
  ) satisfies PetServer;

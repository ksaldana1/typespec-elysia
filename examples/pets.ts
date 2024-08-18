import { Elysia, t, type Static } from "elysia";
import { type PetService } from "./defs.js";

const petType = t.Union([
  t.Literal("cat"),
  t.Literal("dog"),
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

export default new Elysia({ name: "Pet Store" })
  .model({
    petType,
    Pet,
    Pets,
  })
  .get(
    "/pets",
    ({}) => {
      return Object.values(_db);
    },
    { query: t.Object({ filter: t.Optional(petType) }) },
  )
  .get(
    "/pets/:petId",
    ({ params, error }) => {
      const pet = _db[params.petId];
      if (!pet) {
        return error(404, "Not found");
      }
      return pet;
    },
    {},
  ) satisfies PetService;

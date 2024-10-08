import { t } from "elysia";

export const petType = t.Union([
  t.Literal("dog"),
  t.Literal("cat"),
  t.Literal("fish"),
  t.Literal("bird"),
  t.Literal("reptile"),
]);

export const Pet = t.Object({
  id: t.Number({}),
  name: t.String({
    minLength: 1,
  }),
  age: t.Number({
    minimum: 0,
    maximum: 100,
  }),
  kind: petType,
});

export const Todo = t.Object({
  id: t.Number({}),
  text: t.String({
    minLength: 1,
  }),
  completed: t.Boolean(),
});

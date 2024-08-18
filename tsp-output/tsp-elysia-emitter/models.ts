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
  name: t.String({}),
  age: t.Number({}),
  kind: petType,
});

export const NotFoundError = t.Object({
  code: t.Literal(404),
  message: t.String({}),
});

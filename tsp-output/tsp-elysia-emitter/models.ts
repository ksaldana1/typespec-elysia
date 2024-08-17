import {t} from 'elysia'
export const Pet = t.Object({
  id: t.Number()
  ,name: t.String()
  ,age: t.Number()
  ,kind: t.Union([
          t.Literal("dog"),t.Literal("cat"),t.Literal("fish"),t.Literal("bird"),t.Literal("reptile")
      ])
  ,
});export const NotFoundError = t.Object({
  code: t.Literal(404)
  ,message: t.String()
  ,
});export const Todo = t.Object({
  id: t.Number()
  ,text: t.String()
  ,completed: t.Boolean()
  ,
});export const NotFoundError_2 = t.Object({
  code: t.Literal(404)
  ,message: t.String()
  ,
});
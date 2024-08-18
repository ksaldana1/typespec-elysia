import {t} from 'elysia'


export const Todo = t.Object({
  id: t.Number({
          
          
        })
  ,text: t.String({
          minLength: 1,
          
        })
  ,completed: t.Boolean()
  ,
});

export const NotFoundError = t.Object({
  code: t.Literal(404)
  ,message: t.String({
          
          
        })
  ,
});


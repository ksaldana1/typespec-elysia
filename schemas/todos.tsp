import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

using TypeSpec.Http;

@service({
  title: "Todo Service",
})
@server("https://example.com", "Single server endpoint")
namespace TodosStore;

model Todo {
  id: int32;

  @minLength(1)
  text: string;

  completed: boolean;
}

@route("/todos")
namespace Todos {
  @get
  op listTodos(): {
    @body todos: Todo[];
  };

  @get
  op getTodo(@path todoId: int32): {
    @body todo: Todo;
  } | {
    @body error: string;
    @statusCode statusCode: 404;
  };
}

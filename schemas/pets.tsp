import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

using TypeSpec.Http;

@service({
  title: "Pet Store",
})
@server("https://example.com", "Single server endpoint")
namespace PetStore;

model Pet {
  id: int32;
  name: string;
  age: int32;
  kind: petType;
}

enum petType {
  dog: "dog",
  cat: "cat",
  fish: "fish",
  bird: "bird",
  reptile: "reptile",
}

@route("/pets")
namespace Pets {
  @get
  op listPets(@query filter: petType): {
    @body pets: Pet[];
  };

  @get
  op getPet(@path petId: int32): {
    @body pet: Pet;
  } | {
    @body error: NotFoundError;
  };
}

@error
model NotFoundError {
  code: 404;
  message: string;
}

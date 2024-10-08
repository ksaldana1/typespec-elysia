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

  @minLength(1)
  name: string;

  @minValue(0)
  @maxValue(100)
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
  op listPets(@query filter?: petType): {
    @body pets: Pet[];
  };

  @get
  op getPet(@path petId: int32): {
    @body pet: Pet;
  } | {
    @body error: string;
    @statusCode statusCode: 404;
  };

  @post
  op createPet(@body pet: Pet, @header requestId: string): {
    @statusCode statusCode: 201;
    @body newPet: Pet;
  };
}

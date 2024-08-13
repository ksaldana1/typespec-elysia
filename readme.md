## Typespec Elysia

Playing with [TypeSpec](https://typespec.io/) and [Alloy](https://github.com/alloy-framework/alloy) to generate [Elysia](https://elysiajs.com/) types and code.

### Problem

How can we benefit from schema-first API design while not losing the developer experience benefits and ergonomics of code-first approaches?

### Idea

TypeSpec solves the problem of API expressivity and serves as the single source of truth. For the first proof of concept, the idea is to generate the corresponding [Elysia server type](https://github.com/elysiajs/elysia/blob/dc1f0592504f8246193a98db7963240e36b6e675/src/index.ts#L147) to be used as a constraint on the runtime server type. This should cause a compiler 
error if the runtime server does not adhere to the contract expressed by the TypeSpec doc. 

Given the basic `PetStore` example
```typescript
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
```

The corresponding Elysia type would look like

```typescript
type App = Elysia<
  "",
  false,
  {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
  },
  {
    type: {
      readonly petType: "dog" | "cat" | "fish" | "bird" | "reptile";
      readonly Pet: {
        id: number;
        name: string;
        age: number;
        kind: "dog" | "cat" | "fish" | "bird" | "reptile";
      };
      readonly Pets: {
        id: number;
        name: string;
        age: number;
        kind: "dog" | "cat" | "fish" | "bird" | "reptile";
      }[];
    };
    error: {};
  },
  {
    schema: {};
    macro: {};
    macroFn: {};
  },
  {
    pets: {
      get: {
        body: unknown;
        params: {};
        query: {
          filter?: "dog" | "cat" | "fish" | "bird" | "reptile" | undefined;
        };
        headers: unknown;
        response: {
          200: {
            id: number;
            name: string;
            age: number;
            kind: "dog" | "cat" | "fish" | "bird" | "reptile";
          }[];
        };
      };
    };
  } & {
    pets: {
      ":petId": {
        get: {
          body: unknown;
          params: {
            petId: string;
          };
          query: unknown;
          headers: unknown;
          response: {
            readonly 200: {
              id: number;
              name: string;
              age: number;
              kind: "dog" | "cat" | "fish" | "bird" | "reptile";
            };
            readonly 404: string;
          };
        };
      };
    };
  },
  {
    derive: {};
    resolve: {};
    schema: {};
  },
  {
    derive: {};
    resolve: {};
    schema: {};
  }
>;
```

We can then use this type to constrain our server

```typescript
export const server: app = new Elysia()
  .model({ petType, Pet, Pets })
  .get(
    "/pets",
    ({ query }) => {
      const pets = Object.values(_db);
      return query.filter
        ? pets.filter((pet) => pet.kind === query.filter)
        : pets;
    },
    { query: t.Object({ filter: petType }) }
  )
  .get("/pets/:petId", ({ params, error }) => {
    const pet = _db[params.petId];
    if (!pet) {
      return error(404, `Could not find pet with ID: ${params.petId}`);
    }
    return pet;
  });
```

Elysia's type system gives us a pretty good set of guarantees here:
* Exhaustive route check - all routes must implement the contract (enforced route names and route handler return types)
* Forced definition of runtime validators -- for example the above will error if you remove the `query` validator on the `/pets` endpoint
* Forced error handling -- due to the unique way Elysia types responses, we can enforce that endpoints return all possible types. For example if you do not return a `404` error in `/pets/:petId`, it will be a compile time error.

The feedback loops then becomes:
1. Update the TypeSpec with new requirements
2. Regenerate the Elysia types
3. Fix the compiler error that should now be present (assuming a change is needed)

We can also use Elysia's [client library](https://elysiajs.com/eden/treaty/overview) with our types to power our client

```typescript
import { treaty } from "@elysiajs/eden"

const client = treaty<app>("http://localhost:3000");
// data is type Pet[]
const { data } = await client.pets.get({ query: { filter: "dog" } });
// error is constrained to { status: 404; value: string; } 
const { error } = await client.pets({ petId: "123" }).get();
```

Future additions:
* Generate runtime boilerplate for Elysia -- user should really only have to think about service handlers
* How can we make the errors not horrible? This is pretty much a non-starter if errors suck, which they do right now. I believe we can improve them by massaging the output of the code generation a bit. TBD



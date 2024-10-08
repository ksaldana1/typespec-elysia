import { createTypeSpecLibrary } from "@typespec/compiler";

export const $lib = createTypeSpecLibrary({
  name: "tsp-elysia-emitter",
  diagnostics: {},
});

export const { reportDiagnostic, createDiagnostic } = $lib;

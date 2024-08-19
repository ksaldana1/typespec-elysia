import { render } from "@alloy-js/core";
import { type EmitContext, emitFile, resolvePath } from "@typespec/compiler";
import { getAllHttpServices } from "@typespec/http";
import { ElysiaOutput } from "./generate/index.js";
import { format } from "prettier";

export async function $onEmit(context: EmitContext) {
  const [services, _diagnostics] = getAllHttpServices(context.program);

  const output = render(
    <ElysiaOutput services={services} program={context.program} />,
  );

  if (!context.program.compilerOptions.noEmit) {
    for (const file of output.contents) {
      const formatted = await format(file.contents.toString(), {
        parser: "typescript",
      });
      await emitFile(context.program, {
        path: resolvePath(context.emitterOutputDir, file.path),
        content: formatted,
      });
    }
  }
}

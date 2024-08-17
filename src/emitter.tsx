import { render } from "@alloy-js/core";
import { EmitContext, emitFile, resolvePath } from "@typespec/compiler";
import { getAllHttpServices } from "@typespec/http";
import { ElysiaOutput } from "./generate/index.js";

export async function $onEmit(context: EmitContext) {
  const [services, _diagnostics] = getAllHttpServices(context.program);

  const output = render(<ElysiaOutput services={services} />);

  if (!context.program.compilerOptions.noEmit) {
    await emitFile(context.program, {
      path: resolvePath(context.emitterOutputDir, output.contents.at(0)?.path),
      content: output.contents.at(0)?.contents.toString() ?? "",
    });
  }
}

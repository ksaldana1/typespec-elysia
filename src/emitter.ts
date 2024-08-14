import { EmitContext, emitFile, resolvePath } from "@typespec/compiler";
import { getAllHttpServices, HttpService } from "@typespec/http";
import { parseHTTPService } from "./parse/index.js";

export async function $onEmit(context: EmitContext) {
  const services = getAllHttpServices(context.program);
  console.log(services);
  const service = services.at(0)!.at(0) as HttpService;

  parseHTTPService(service);

  if (!context.program.compilerOptions.noEmit) {
    await emitFile(context.program, {
      path: resolvePath(context.emitterOutputDir, "output.txt"),
      content: "Hello world\n",
    });
  }
}

import { HttpService } from "@typespec/http";
import { modelOutput } from "../generate/index.js";
import { Model } from "@typespec/compiler";
import { render as _render, renderEnum } from "../generate/enums.js";
import { render } from "@alloy-js/core";

export function parseHTTPService(service: HttpService) {
  const e = Array.from(service.namespace.enums.values()).at(0);
  console.log(render(_render(e!)));
}

export function getModels(n: HttpService): Map<string, Model> {
  return n.namespace.models;
}

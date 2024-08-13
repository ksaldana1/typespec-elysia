import { HttpService } from "@typespec/http";
import { modelOutput } from "../generate/index.js";
import { Model } from "@typespec/compiler";

export function parseHTTPService(service: HttpService) {
  return modelOutput(getModels(service));
}

export function getModels(n: HttpService): Map<string, Model> {
  return n.namespace.models;
}

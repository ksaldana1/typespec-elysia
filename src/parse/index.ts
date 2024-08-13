import { HttpService } from "@typespec/http";
import { elysiaOutput } from "../generate/index.js";
console.log(elysiaOutput);

export function parseHTTPService(service: HttpService) {
  return service.namespace;
}

export function getModels(n: HttpService) {
  return n.namespace.models;
}

import { HttpService } from "@typespec/http";

export function parseHTTPService(service: HttpService) {
  return getModels(service);
}

export function getModels(n: HttpService) {
  return n.namespace.models;
}

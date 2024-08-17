import { Output } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { type HttpService } from "@typespec/http";
import { Model } from "./models.js";
import { EnumModel } from "./enums.js";

export const elysia = ts.createPackage({
  name: "elysia",
  version: "1.1.6",
  descriptor: {
    ".": {
      named: ["Elysia", "t"],
    },
  },
});

const Models = ({ services }: { services: HttpService[] }) => {
  return services
    .map((service) => Array.from(service.namespace.models.values()))
    .flat()
    .map((model) => (
      <>
        <Model model={model} />
        {"\n"}
      </>
    ));
};

const Enums = ({ services }: { services: HttpService[] }) => {
  return services
    .map((service) => Array.from(service.namespace.enums.values()))
    .flat()
    .map((e) => (
      <>
        <EnumModel e={e} />
        {"\n"}
      </>
    ));
};

export const ElysiaOutput = ({ services }: { services: HttpService[] }) => {
  return (
    <Output externals={[elysia]}>
      <ts.SourceFile path="models.ts">
        {"import {t} from 'elysia'\n"}
        <Enums services={services} />
        <Models services={services} />
      </ts.SourceFile>
    </Output>
  );
};

import { Output } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { type HttpService } from "@typespec/http";
import { Enums } from "./enums.js";
import { Models } from "./models.js";

export const elysia = ts.createPackage({
  name: "elysia",
  version: "1.1.6",
  descriptor: {
    ".": {
      named: ["Elysia", "t"],
    },
  },
});

export const ElysiaOutput = ({ services }: { services: HttpService[] }) => {
  return (
    <Output externals={[elysia]}>
      <ts.SourceFile path="models.ts">
        {"import {t} from 'elysia'\n"}
        <Enums services={services} />
        <Models services={services} />
      </ts.SourceFile>
      <ts.SourceFile path="server.ts">
        {"import {Elysia, Static} from 'elsyia';"}
        {"import * as models from './models';"}
      </ts.SourceFile>
    </Output>
  );
};

import { Output } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { type HttpService } from "@typespec/http";
import { Enums } from "./enums.js";
import { Models } from "./models.js";
import { type Program } from "@typespec/compiler";
import { ProgramProvider } from "./context/ProgramContext.js";
import { Definitions, Routes } from "./elysia.js";

export const elysia = ts.createPackage({
  name: "elysia",
  version: "1.1.6",
  descriptor: {
    ".": {
      named: ["Elysia", "t"],
    },
  },
});

export const ElysiaOutput = ({
  services,
  program,
}: {
  services: HttpService[];
  program: Program;
}) => {
  return (
    <ProgramProvider program={program}>
      <Output externals={[elysia]}>
        <ts.SourceFile path="models.ts">
          {"import {t} from 'elysia'\n"}
          <Enums services={services} />
          <Models services={services} />
        </ts.SourceFile>
        <ts.SourceFile path="service.ts">
          {"import {Elysia, Static} from 'elsyia';"}
          {"import * as models from './models.js';\n"}
          <Routes services={services} />
        </ts.SourceFile>
      </Output>
    </ProgramProvider>
  );
};

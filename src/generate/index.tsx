import { Output, code } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { ModelProperty, type Model } from "@typespec/compiler";
import { type HttpService } from "@typespec/http";
import { match, P } from "ts-pattern";

export const elysia = ts.createPackage({
  name: "elysia",
  version: "1.1.6",
  descriptor: {
    ".": {
      named: ["Elysia", "t"],
    },
  },
});

const Model = ({ model }: { model: Model }) => {
  return (
    <ts.VarDeclaration export name={model.name}>
      {code`t.Object(${(
        <ts.ObjectExpression>
          {Array.from(model.properties.values()).map((property) => {
            return (
              <>
                <ts.ObjectProperty
                  name={property.name}
                  value={propertyTypeToValue({ property })}
                />
                ,
              </>
            );
          })}
        </ts.ObjectExpression>
      )})`}
    </ts.VarDeclaration>
  );
};

const propertyTypeToValue = ({ property }: { property: ModelProperty }) => {
  if (property.type.kind === "Enum") {
    console.log(Array.from(property.type.members.values()));
  }
  return match(property.type)
    .with({ kind: "Scalar", name: "int32" }, () => "t.Number()")
    .with({ kind: "Scalar", name: "boolean" }, () => "t.Boolean()")
    .with({ kind: "Scalar", name: "string" }, () => "t.String()")
    .with({ kind: "Number" }, ({ value }) => `t.Literal(${value})`)
    .with({ kind: "Enum" }, ({ members }) => {
      const m = Array.from(members.values());
      return `t.Union([
        ${m.map((property) => `t.Literal("${property.name}")`)}
    ])`;
    })
    .otherwise(() => "t.Number()");
};

export const ElysiaOutput = ({ services }: { services: HttpService[] }) => {
  return (
    <Output externals={[elysia]}>
      <ts.SourceFile path="models.ts">
        {"import {t} from 'elysia'"}
        {services
          .map((service) => Array.from(service.namespace.models.values()))
          .flat()
          .map((model) => (
            <Model model={model} />
          ))}
      </ts.SourceFile>
    </Output>
  );
};

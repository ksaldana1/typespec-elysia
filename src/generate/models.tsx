import { code } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { type Model as ModelType, ModelProperty } from "@typespec/compiler";
import { HttpService } from "@typespec/http";
import { match } from "ts-pattern";

export const Models = ({ services }: { services: HttpService[] }) => {
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

export const Model = ({ model }: { model: ModelType }) => {
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
      )})\n`}
    </ts.VarDeclaration>
  );
};

const propertyTypeToValue = ({ property }: { property: ModelProperty }) => {
  return match(property.type)
    .with({ kind: "Scalar", name: "int32" }, () => "t.Number()")
    .with({ kind: "Scalar", name: "boolean" }, () => "t.Boolean()")
    .with({ kind: "Scalar", name: "string" }, () => "t.String()")
    .with({ kind: "Number" }, ({ value }) => `t.Literal(${value})`)
    .with({ kind: "Enum" }, ({ name }) => name)
    .otherwise(() => "t.Number()");
};

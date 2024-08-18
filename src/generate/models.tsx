import { code } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import {
  type ModelProperty,
  type Model as ModelType,
  type Program,
  getMaxLength,
  getMaxValue,
  getMinLength,
  getMinValue,
} from "@typespec/compiler";
import { type HttpService } from "@typespec/http";
import { match } from "ts-pattern";
import { useProgramContext } from "./context/ProgramContext.js";

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
  const program = useProgramContext();
  return (
    <ts.VarDeclaration export name={model.name}>
      {code`t.Object(${(
        <ts.ObjectExpression>
          {Array.from(model.properties.values()).map((property) => {
            return (
              <>
                <ts.ObjectProperty
                  name={property.name}
                  value={propertyTypeToValue({ property, program })}
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

const propertyTypeToValue = ({
  property,
  program,
}: {
  property: ModelProperty;
  program: Program;
}) => {
  return match(property.type)
    .with({ kind: "Scalar", name: "int32" }, () => {
      const [minValue, maxValue] = [
        getMinValue(program, property.type),
        getMaxValue(program, property.type),
      ];

      return `t.Number({
        ${minValue != null ? `minimum: ${minValue},` : ""}
        ${maxValue != null ? `maximum: ${maxValue}` : ""}
      })`;
    })
    .with({ kind: "Scalar", name: "boolean" }, () => "t.Boolean()")
    .with({ kind: "Scalar", name: "string" }, () => {
      const [minLength, maxLength] = [
        getMinLength(program, property.type),
        getMaxLength(program, property.type),
      ];

      return `t.String({
        ${minLength != null ? `minLength: ${minLength},` : ""}
        ${maxLength != null ? `maxLength: ${maxLength}` : ""}
      })`;
    })
    .with({ kind: "Number" }, ({ value }) => `t.Literal(${value})`)
    .with({ kind: "Enum" }, ({ name }) => name)
    .otherwise(() => "t.Number()");
};

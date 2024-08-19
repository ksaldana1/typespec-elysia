import {
  type HttpService,
  type HttpOperation,
  getResponsesForOperation,
  HttpProperty,
  HttpOperationResponse,
} from "@typespec/http";
import * as ts from "@alloy-js/typescript";
import { useProgramContext } from "./context/ProgramContext.js";
import { match } from "ts-pattern";

export const Definitions = ({ services }: { services: HttpService[] }) => {
  return services
    .map((service) => Array.from(service.operations.values()))
    .map((operations) => (
      <>
        <ts.InterfaceDeclaration
          name={`${operations.at(0)?.container.name}Models`}
        >
          {operations.map((operation) => (
            <Definition operation={operation} />
          ))}
        </ts.InterfaceDeclaration>
        {"\n"}
      </>
    ));
};

const Definition = ({ operation }: { operation: HttpOperation }) => {
  const program = useProgramContext();
  const [responses, _diagnostics] = getResponsesForOperation(
    program,
    operation.operation,
  );
  return null;
};

export const Routes = ({ services }: { services: HttpService[] }) => {
  return services
    .map((service) => Array.from(service.operations.values()))
    .map((operations) => {
      const groupedByPath = Object.groupBy(operations, (op) => {
        return (
          op.path
            .split("/")
            .filter((x) => Boolean(x))
            .at(0) ?? ""
        );
      });
      return (
        <>
          <ts.TypeDeclaration
            export
            name={`${operations.at(0)?.container.name}Routes`}
          >
            <ts.InterfaceExpression>
              {Object.entries(groupedByPath).map(([key, operations]) => {
                return (
                  <>
                    <ts.InterfaceMember
                      name={key}
                      type={
                        <ts.InterfaceExpression>
                          {operations?.map((operation) => (
                            <Route operation={operation} />
                          ))}
                        </ts.InterfaceExpression>
                      }
                    />
                  </>
                );
              })}
            </ts.InterfaceExpression>
          </ts.TypeDeclaration>
          {"\n"}
        </>
      );
    });
};

const Route = ({ operation }: { operation: HttpOperation }) => {
  const name =
    operation.path.split("/").filter((v) => Boolean(v))?.length === 1
      ? operation.verb
      : operation.operation.name;

  return (
    <>
      <ts.InterfaceMember
        name={name === operation.verb ? name : "testing"}
        type={
          <ts.InterfaceExpression>
            <RouteTypes httpOperation={operation} />
          </ts.InterfaceExpression>
        }
      />
      {";"}
    </>
  );
};

const RouteTypes = ({ httpOperation }: { httpOperation: HttpOperation }) => {
  const program = useProgramContext();
  const [responses, _diagnostics] = getResponsesForOperation(
    program,
    httpOperation.operation,
  );

  const queryParams = httpOperation.parameters.properties.filter(
    (p) => p.kind === "query",
  );

  const pathParams = httpOperation.parameters.properties.filter(
    (p) => p.kind === "path",
  );

  return (
    <>
      <Body responses={responses} />
      <Path properties={pathParams} />
      <Query properties={queryParams} />
      <ts.InterfaceMember name="headers" type="unknown" />
      <ts.InterfaceMember name="response" type="unknown" />
    </>
  );
};

const Path = ({ properties }: { properties?: HttpProperty[] }) => {
  const type =
    properties?.reduce((acc, curr) => {
      return (acc += `${curr.property.name}: string\n`);
    }, "") ?? "unknown";
  return <ts.InterfaceMember name="params" type={`{ ${type} }`} />;
};

const Query = ({ properties }: { properties?: HttpProperty[] }) => {
  const type = properties?.reduce((acc, property) => {
    return (acc += match(property?.property.type.kind)
      .with("Enum", () => {
        if (property?.property.type.kind === "Enum") {
          return `${property?.property.name}: Static<typeof models.${property?.property.type.name}>;`;
        }
      })
      .with("Scalar", () => {
        return `${property?.property.name}: string; `;
      })
      .otherwise(() => "unknown"));
  }, "");

  return (
    <ts.InterfaceMember name="query" type={type ? `{ ${type} }` : "unknown"} />
  );
};

const Body = ({ responses }: { responses: HttpOperationResponse[] }) => {
  // responses is an array of each endpoint
  // responses.responses is the array of each endpoint
  const type = responses?.reduce((acc, response) => {
    console.log(response.responses);
    return (acc += `readonly ${response.statusCodes}: unknown;`);
  }, "");
  return (
    <ts.InterfaceMember name="body" type={type ? `{ ${type} }` : "unknown"} />
  );
};

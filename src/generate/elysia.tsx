import {
  type HttpService,
  type HttpOperation,
  type HttpProperty,
  type HttpOperationResponse,
  getResponsesForOperation,
} from "@typespec/http";
import * as ts from "@alloy-js/typescript";
import { useProgramContext } from "./context/ProgramContext.js";
import { match, P } from "ts-pattern";

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
  function _route(path: string) {
    const [_basePath, ...rest] = path.split("/").filter((v) => Boolean(v));

    if (rest.length === 0) {
      return (
        <>
          <ts.InterfaceMember
            name={operation.verb}
            type={
              <ts.InterfaceExpression>
                <RouteTypes httpOperation={operation} />
              </ts.InterfaceExpression>
            }
          />
          {";"}
        </>
      );
    } else {
      const propertyName =
        rest?.at(0)?.at(-1) === "}"
          ? `":${rest.at(0)?.replaceAll(/[{}]/g, "")}"`
          : rest.at(0);
      return (
        <>
          <ts.InterfaceMember
            name={propertyName}
            type={
              <ts.InterfaceExpression>
                {_route(rest.join("/"))}
              </ts.InterfaceExpression>
            }
          />
          {";"}
        </>
      );
    }
  }

  return _route(operation.path);
};

const RouteTypes = ({ httpOperation }: { httpOperation: HttpOperation }) => {
  const program = useProgramContext();
  const [responses, _diagnostics] = getResponsesForOperation(
    program,
    httpOperation.operation,
  );

  const { query, path, body, header } = Object.groupBy(
    httpOperation.parameters.properties,
    (property) => property.kind,
  );

  return (
    <>
      <Body properties={body} />
      <Path properties={path} />
      <Query properties={query} />
      <Headers properties={header} />
      <Responses responses={responses} />
    </>
  );
};

const Body = ({ properties }: { properties?: HttpProperty[] }) => {
  const type = properties?.reduce((acc, property) => {
    const t = match(property.property.type)
      .with({ kind: "Model", name: "Array" }, (type) => {
        // @ts-expect-error probably a better way
        return `${property.property.name}: Array<Static<typeof models.${type.indexer?.value.name}>>;`;
      })
      .with({ kind: "Model", name: P.not("Array") }, (type) => {
        return `${property.property.name}: Static<typeof models.${type.name}>;`;
      })
      .with({ kind: "Scalar" }, (type) => {
        return `${property.property.name}: ${type.name === "string" ? type.name : "number"};`;
      })
      .otherwise(() => {
        return `readonly ${property.property.name}: unknown;`;
      });

    return (acc += t);
  }, "");
  return (
    <ts.InterfaceMember name="body" type={type ? `{ ${type} }` : `unknown`} />
  );
};

const Path = ({ properties }: { properties?: HttpProperty[] }) => {
  const type = properties?.reduce((acc, curr) => {
    return (acc += `${curr.property.name}: string\n`);
  }, "");
  return (
    <ts.InterfaceMember name="params" type={type ? `{ ${type} }` : `{}`} />
  );
};

const Headers = ({ properties }: { properties?: HttpProperty[] }) => {
  const type = properties?.reduce((acc, curr) => {
    if (curr.kind === "header") {
      return (acc += `"${curr.options.name}": string\n`);
    } else {
      return acc;
    }
  }, "");
  return (
    <ts.InterfaceMember
      name="headers"
      type={type ? `{ ${type} }` : `unknown`}
    />
  );
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

const Responses = ({ responses }: { responses: HttpOperationResponse[] }) => {
  // responses is an array of each endpoint
  // responses.responses is the array of each endpoint
  const type = responses?.reduce((acc, response) => {
    const resp = response.responses.at(0);
    if (!resp) {
      return acc;
    }
    const t = match(resp.body?.type)
      .with({ kind: "Model", name: "Array" }, (type) => {
        // @ts-expect-error probably a better way
        return `readonly ${response.statusCodes}: Array<Static<typeof models.${type.indexer?.value.name}>>;`;
      })
      .with({ kind: "Model", name: P.not("Array") }, (type) => {
        return `readonly ${response.statusCodes}: Static<typeof models.${type.name}>;`;
      })
      .with({ kind: "Scalar" }, (type) => {
        return `readonly ${response.statusCodes}: ${type.name === "string" ? type.name : "number"};`;
      })
      .otherwise(() => {
        return `readonly ${response.statusCodes}: unknown;`;
      });
    return (acc += t);
  }, "");
  return (
    <ts.InterfaceMember
      name="response"
      type={type ? `{ ${type} }` : "unknown"}
    />
  );
};

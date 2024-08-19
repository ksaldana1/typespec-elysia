import {
  type HttpService,
  type HttpOperation,
  getResponsesForOperation,
} from "@typespec/http";
import * as ts from "@alloy-js/typescript";
import { useProgramContext } from "./context/ProgramContext.js";

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

export const Definition = ({ operation }: { operation: HttpOperation }) => {
  const program = useProgramContext();
  const [responses, _diagnostics] = getResponsesForOperation(
    program,
    operation.operation,
  );
  console.log(responses);
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

export const Route = ({ operation }: { operation: HttpOperation }) => {
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
            <RouteTypes operation={operation} />
          </ts.InterfaceExpression>
        }
      />
      {";"}
    </>
  );
};

export const RouteTypes = ({ operation }: { operation: HttpOperation }) => {
  return (
    <>
      <ts.InterfaceMember name="body" type="unknown" />
      <ts.InterfaceMember name="params" type="{}" />
      <ts.InterfaceMember name="query" type="unknown" />
      <ts.InterfaceMember name="headers" type="unknown" />
      <ts.InterfaceMember name="response" type="unknown" />
    </>
  );
};

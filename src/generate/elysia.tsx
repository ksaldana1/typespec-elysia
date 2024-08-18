import { type HttpService, type HttpOperation } from "@typespec/http";
import * as ts from "@alloy-js/typescript";

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
  console.log(operation.responses.at(0)?.responses);
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
  console.log("op", operation);
  const name =
    operation.path.split("/").filter((v) => Boolean(v))?.length === 1
      ? operation.verb
      : operation.operation.name;
  return (
    <ts.InterfaceMember
      name={name}
      type={
        <ts.InterfaceExpression>
          <ts.InterfaceMember name={operation.operation.name} type="string" />
        </ts.InterfaceExpression>
      }
    />
  );
};

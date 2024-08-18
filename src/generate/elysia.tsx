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
  return null;
};

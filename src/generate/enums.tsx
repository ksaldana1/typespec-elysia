import { code } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { type Enum } from "@typespec/compiler";
import { type HttpService } from "@typespec/http";

export const Enums = ({ services }: { services: HttpService[] }) => {
  return services
    .map((service) => Array.from(service.namespace.enums.values()))
    .flat()
    .map((e) => (
      <>
        <EnumModel e={e} />
        {"\n"}
      </>
    ));
};

export const EnumModel = ({ e }: { e: Enum }) => {
  return (
    <ts.VarDeclaration export name={e.name}>
      {code`t.Union([${Array.from(e.members.values()).map((m) => `t.Literal("${m.value}"),\n`)}])`}
    </ts.VarDeclaration>
  );
};

import { code } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { Enum } from "@typespec/compiler";

export const EnumModel = ({ e }: { e: Enum }) => {
  return (
    <ts.VarDeclaration export name={e.name}>
      {code`t.Union([${Array.from(e.members.values()).map((m) => `t.Literal("${m.value}"),\n`)}])`}
    </ts.VarDeclaration>
  );
};

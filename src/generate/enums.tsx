import { Enum, EnumMember } from "@typespec/compiler";
import * as ts from "@alloy-js/typescript";
import { code, Output } from "@alloy-js/core";
import { elysia } from "./index.js";

export const render = (e: Enum) => {
  return (
    <Output externals={[elysia]}>
      <ts.SourceFile path="models.ts">{renderEnum(e)}</ts.SourceFile>
    </Output>
  );
};

export const renderEnum = (e: Enum) => {
  return code`
const ${e.name} = ${(<ts.Reference refkey={elysia.t} />)}.Union(${renderEnumMembers(Array.from(e.members.values()))})
`;
};

const renderEnumMembers = (members: EnumMember[]) => {
  return code`[
${members.map((m) => `t.Literal(${m.value}),\n`)}]`;
};

import { code } from "@alloy-js/core";
import { Enum, EnumMember } from "@typespec/compiler";

export const EnumModel = ({ e }: { e: Enum }) => {
  return code`
const ${e.name} = t.Union(${renderEnumMembers(Array.from(e.members.values()))})
`;
};

const renderEnumMembers = (members: EnumMember[]) => {
  return code`[
${members.map((m) => `t.Literal("${m.value}"),\n`)}]`;
};

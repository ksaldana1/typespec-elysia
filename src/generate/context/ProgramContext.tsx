import { type Children, createContext, useContext } from "@alloy-js/core";
import { type Program } from "@typespec/compiler";

export const ProgramContext = createContext<Program>();

export function ProgramProvider({
  program,
  children,
}: {
  program: Program;
  children?: Children;
}) {
  return (
    <ProgramContext.Provider value={program}>
      {children}
    </ProgramContext.Provider>
  );
}

export const useProgramContext = () => {
  return useContext(ProgramContext);
};

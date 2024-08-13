import { Output, refkey, render } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";

export const output = render(
  <Output>
    <ts.SourceFile path="test1.ts">
      <ts.FunctionDeclaration export default name="test1">
        console.log("foo bar baz");
      </ts.FunctionDeclaration>
      <ts.FunctionDeclaration export name="test2" />
    </ts.SourceFile>

    <ts.SourceFile path="test2.ts">
      <ts.FunctionDeclaration
        export
        default
        name="test1"
        refkey={refkey("test3")}
      />
      <ts.FunctionDeclaration export name="test2" refkey={refkey("test4")} />
    </ts.SourceFile>

    <ts.SourceFile path="test3.ts">
      const v1 = <ts.Reference refkey={refkey("test1")} />; const v2 ={" "}
      <ts.Reference refkey={refkey("test2")} />; const v3 ={" "}
      <ts.Reference refkey={refkey("test3")} />; const v4 ={" "}
      <ts.Reference refkey={refkey("test4")} />;
    </ts.SourceFile>
  </Output>
);

const elysia = ts.createPackage({
  name: "elysia",
  version: "1.1.6",
  descriptor: {
    ".": {
      named: ["Elysia"],
    },
  },
});

export const elysiaOutput = render(
  <Output externals={[elysia]}>
    <ts.SourceFile path="server.ts">
      const x = <ts.Reference refkey={elysia.Elysia} />
      <ts.TypeDeclaration name="App" export refkey={refkey("app")}>
        <ts.InterfaceExpression>
          <ts.InterfaceMember name="name" type="string" />
        </ts.InterfaceExpression>
      </ts.TypeDeclaration>
    </ts.SourceFile>
  </Output>
);

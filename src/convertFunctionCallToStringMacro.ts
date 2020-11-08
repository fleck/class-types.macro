import { createMacro, MacroError } from "babel-plugin-macros";
import * as t from "@babel/types";

export default createMacro(({ references }) => {
  let keepImports = true;

  references.default?.forEach(referencePath => {
    keepImports = false;
    let callExpression: t.CallExpression;

    if (referencePath.parentPath.node.type === "CallExpression") {
      callExpression = referencePath.parentPath.node;
    } else {
      throw new MacroError("ct.macro can only be called as a function");
    }

    const literals = callExpression.arguments.filter(function notEmpty<TValue>(
      argument: TValue
    ): argument is Extract<TValue, { value: any }> {
      return "value" in argument;
    });

    if (referencePath.parentPath.parentPath.type === "JSXExpressionContainer") {
      referencePath.parentPath.parentPath.replaceWith(
        t.stringLiteral(literals.join(" "))
      );
    } else {
      referencePath.parentPath.replaceWith(t.stringLiteral(literals.join(" ")));
    }
  });

  return {
    keepImports,
  };
});

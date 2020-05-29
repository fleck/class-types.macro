import { createMacro, MacroError } from "babel-plugin-macros";
import * as t from "@babel/types";

export default createMacro(({ references }) => {
  references.default?.forEach(referencePath => {
    let callExpression: t.CallExpression;

    if (referencePath.parentPath.node.type === "CallExpression") {
      callExpression = referencePath.parentPath.node;
    } else {
      throw new MacroError("ct.macro can only be called as a function");
    }

    const classes = callExpression.arguments.map(argument => {
      if (!("value" in argument)) {
        throw new MacroError(
          "Arguments must be strings or convertible to strings (number, boolean)"
        );
      }

      return argument.value;
    });

    if (referencePath.parentPath.parentPath.type === "JSXExpressionContainer") {
      referencePath.parentPath.parentPath.replaceWith(
        t.stringLiteral(classes.join(" "))
      );
    } else {
      referencePath.parentPath.replaceWith(t.stringLiteral(classes.join(" ")));
    }
  });
});

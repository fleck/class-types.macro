import { createMacro, MacroError } from "babel-plugin-macros";
import * as t from "@babel/types";
import lodashUniq from "lodash/uniq";

export default createMacro(({ references, state }) => {
  references.default.forEach(referencePath => {
    let callExpression: t.CallExpression;

    if (referencePath.parentPath.node.type === "CallExpression") {
      callExpression = referencePath.parentPath.node;
    } else {
      throw new MacroError(
        "class-types macro can only be called as a function"
      );
    }

    const classes = callExpression.arguments.map(argument => {
      if (!("value" in argument)) {
        throw new MacroError(
          "Arguments must be strings or convertible to strings (number, boolean)"
        );
      }

      return argument.value;
    });

    const uniqClasses = lodashUniq(classes);

    if (!(uniqClasses.length === classes.length)) {
      throw new MacroError(`

👋 Duplicate classes found

Please use these classes:

"${uniqClasses.join('", "')}"

in this function: ${state.file.opts.filename}:${
        referencePath.node.loc?.start.line
      }:${referencePath.node.loc?.start.column}

      `);
    }

    if (referencePath.parentPath.parentPath.type === "JSXExpressionContainer") {
      referencePath.parentPath.parentPath.replaceWith(
        t.stringLiteral(classes.join(" "))
      );
    } else {
      referencePath.parentPath.replaceWith(t.stringLiteral(classes.join(" ")));
    }
  });
});

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

    const literals = callExpression.arguments.filter(function nonLiterals<T>(
      argument: T
    ): argument is Extract<T, { value: any }> {
      return "value" in argument;
    });

    type Argument = t.CallExpression["arguments"][number];

    const identifiers = callExpression.arguments.filter(function nonIdentifiers<
      T extends Argument
    >(argument: T): argument is Extract<T, { type: "Identifier" }> {
      return "type" in argument && argument.type === "Identifier";
    });

    // If any args aren't literals or identifiers throw...

    let argumentsNode;

    if (referencePath.parentPath.parentPath.type === "JSXExpressionContainer") {
      argumentsNode = referencePath.parentPath.parentPath;
    } else {
      argumentsNode = referencePath.parentPath;
    }

    let toAdd;

    type AstNode = typeof literals[number] | typeof identifiers[number];

    const concat = (nodes: AstNode[], index: number): t.BinaryExpression => {
      // 0
      return t.binaryExpression(
        "+",
        nodes[index],
        t.binaryExpression(
          "+",
          t.stringLiteral(" "),
          nodes[index + 2] ? concat(nodes, index + 1) : nodes[index + 1]
        )
      );
    };

    const nodes = literals.length
      ? [
          t.stringLiteral(literals.map(literal => literal.value).join(" ")),
          ...identifiers,
        ]
      : [...identifiers];

    if (nodes.length === 1) {
      toAdd = nodes[0];
    } else if (nodes.length) {
      toAdd = concat(nodes, 0);
    } else {
      throw new MacroError(
        "ct.macro requires at least 1 argument and arguments must be literals or identifiers (variables)"
      );
    }

    argumentsNode.replaceWith(toAdd);
  });

  return {
    keepImports,
  };
});

import { createMacro, MacroError } from "babel-plugin-macros";
import * as t from "@babel/types";
import { NodePath } from "@babel/traverse";

/**
 * We include this type so VS Code will auto import this library when a user
 * types ct. Eventually we can actually export a working implementation for
 * TypeScript users who don't have babel setup.
 */
type macro = () => string;

type Argument = t.CallExpression["arguments"][number];

const transformArgs = (args: Argument[]) => {
  const literals = args.filter(function nonLiterals<T>(
    argument: T
  ): argument is Extract<T, { value: any }> {
    return "value" in argument;
  });

  type Argument = t.CallExpression["arguments"][number];

  const allowedArguments = [
    "Identifier",
    "ConditionalExpression",
    "CallExpression",
    "MemberExpression",
  ] as const;

  type AllowedArguments = typeof allowedArguments[number];

  let identifiers = args.filter(function nonIdentifiers<T extends Argument>(
    argument: T
  ): argument is Extract<T, { type: AllowedArguments }> {
    return (
      "type" in argument &&
      allowedArguments.includes(argument.type as AllowedArguments)
    );
  });

  return literals.length
    ? [
        t.stringLiteral(literals.map(literal => literal.value).join(" ")),
        ...identifiers,
      ]
    : [...identifiers];
};

const replace = (
  callExpressionPath: NodePath<t.Node> | NodePath<t.CallExpression>,
  callExpression: t.CallExpression
) => {
  let toAdd;

  const nodes = transformArgs(callExpression.arguments);

  const concat = (index: number): t.BinaryExpression => {
    return t.binaryExpression(
      "+",
      nodes[index],
      t.binaryExpression(
        "+",
        t.stringLiteral(" "),
        nodes[index + 2] ? concat(index + 1) : nodes[index + 1]
      )
    );
  };

  if (nodes.length === 1) {
    toAdd = nodes[0];
  } else if (nodes.length) {
    if (callExpressionPath.isJSXExpressionContainer()) {
      toAdd = t.jsxExpressionContainer(concat(0));
    } else {
      toAdd = concat(0);
    }
  } else {
    throw new MacroError(
      "class-types.macro requires at least 1 argument and arguments must be literals or identifiers (variables)"
    );
  }

  callExpressionPath.replaceWith(toAdd);
};

const ct: macro = createMacro(({ references }) => {
  let keepImports = true;

  references.default?.forEach(referencePath => {
    keepImports = false;

    referencePath.parentPath.parentPath.traverse({
      CallExpression: callExpressionPath => {
        if (
          callExpressionPath.node.callee.type === "Identifier" &&
          callExpressionPath.node.callee.name === "ct"
        ) {
          replace(callExpressionPath, callExpressionPath.node);
        }
      },
    });
  });

  return {
    keepImports,
  };
});

export default ct;

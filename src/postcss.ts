import * as appRoot from "app-root-path";
import postcssTsClassnames from "postcss-ts-classnames/dist/plugin";
import nodePath from "path";
import fs from "fs-extra";

export default function postcssClassTypes({ directory = "" } = {}) {
  const dest =
    directory || nodePath.join(appRoot.toString(), "@types", "class-types");

  fs.outputFile(
    nodePath.join(dest, "ct.macro.d.ts"),
    `\
declare module "ct.macro" {
  const _default: (...args: ClassNames[]) => string;

  export default _default;
}`
  );

  return postcssTsClassnames({
    dest: nodePath.join(dest, "classnames.d.ts"),
  });
}

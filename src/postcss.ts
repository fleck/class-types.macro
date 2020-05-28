import appRoot from "app-root-path";
import postcssTsClassnames from "postcss-ts-classnames/dist/plugin";
import nodePath from "path";
import fs from "fs-extra";

export const defaultDirectory = nodePath.join(
  appRoot.toString(),
  "@types",
  "class-types"
);

export const classnamesFilename = "classnames.d.ts";

export default ({ directory = "" } = {}) => {
  const dest = directory || defaultDirectory;

  fs.outputFile(
    nodePath.join(dest, "ct.macro.d.ts"),
    `\
// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
declare module "ct.macro" {
  const _default: (...args: ClassNames[]) => string;

  export default _default;
}`
  );

  return postcssTsClassnames({
    dest: nodePath.join(dest, classnamesFilename),
  });
};

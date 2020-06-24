import postcss from "postcss";
import { postcss as plugin, options } from "../src/postcssPlugin";
import fs from "fs-extra";
import path from "path";

async function run(input: string, opts: options) {
  let result = await postcss([plugin(opts)]).process(input, {
    from: undefined,
  });

  expect(result.warnings()).toHaveLength(0);
}

const typesDirectory = path.join(__dirname, "..", "@types");

const cleanupFiles = () => {
  fs.removeSync(typesDirectory);
};

beforeEach(cleanupFiles);
afterEach(cleanupFiles);

const classNamesPath = path.join(typesDirectory, "ct.macro", "classNames.d.ts");

it("generates types for classes", async () => {
  await run(".mt-1{ } .mt-2{}", {});

  expect((await fs.readFile(classNamesPath)).toString()).toMatchSnapshot();
});

it("does not include ids, pseudo selectors, or attributes", async () => {
  await run(
    '#app .mt-1{ } #app .mt-2:hover{} [data-reach-slider-input][data-orientation="horizontal"] {}',
    {}
  );

  expect((await fs.readFile(classNamesPath)).toString()).toMatchSnapshot();
});

it("supports custom directories", async () => {
  const directory = path.join(typesDirectory, "custom");

  await run("#app .mt-1{ } #app .mt-2:hover{}", { directory });

  expect(
    (await fs.readFile(path.join(directory, "classNames.d.ts"))).toString()
  ).toMatchSnapshot();
});

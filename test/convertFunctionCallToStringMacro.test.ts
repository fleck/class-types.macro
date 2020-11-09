import pluginTester from "babel-plugin-tester";
import plugin from "babel-plugin-macros";

pluginTester({
  plugin,
  babelOptions: { filename: __filename, presets: ["@babel/preset-react"] },
  tests: {
    "fail if not a function": {
      error: true,
      code: `
      import ct from '../../ct.macro';

      ct({someOption: true}, \`
        some stuff
      \`)
    `,
    },
    "transform function call to string": {
      code: `
        import ct from '../../ct.macro';
  
        ct("class", "other-class")
      `,
      output: '"class other-class";',
    },
    "transform function call with single argument identifier to just an identifier": {
      code: `
        import ct from '../../ct.macro';

        const style = ct("class", "other-class");
  
        ct(style);
      `,
      output: `const style = "class other-class";
style;`,
    },
    "transform a function call with 2 identifiers to a binary expression": {
      code: `
        import ct from '../../ct.macro';

        const style = ct("class", "other-class");

        const style2 = ct("other");
  
        ct(style, style2);
      `,
      output: `const style = "class other-class";
const style2 = "other";
style + (" " + style2);`,
    },
    "transform jsx string": {
      code: `
          import ct from '../../ct.macro';
    
          <div className={ct("class", "other-class")} />;
        `,
      snapshot: true,
    },
  },
});

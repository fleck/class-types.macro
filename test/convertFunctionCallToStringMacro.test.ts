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
    "transform jsx string": {
      code: `
          import ct from '../../ct.macro';
    
          <div className={ct("class", "other-class")} />;
        `,
      snapshot: true,
    },
  },
});

import pluginTester from "babel-plugin-tester";
import plugin from "babel-plugin-macros";

pluginTester({
  plugin,
  babelOptions: { filename: __filename, presets: ["@babel/preset-react"] },
  tests: {
    "fail if not a function": {
      error: true,
      code: `
      import ct from '../../class-types.macro';

      ct({someOption: true}, \`
        some stuff
      \`)
    `,
    },
    "transform function call to string": {
      code: `
        import ct from '../../class-types.macro';
  
        ct("class", "other-class")
      `,
      output: '"class other-class";',
    },
    "transform function call with single argument identifier to just an identifier": {
      code: `
        import ct from '../../class-types.macro';

        const style = ct("class", "other-class");
  
        ct(style);
      `,
      output: `const style = "class other-class";
style;`,
    },
    "transform a function call with 2 identifiers to a binary expression": {
      code: `
        import ct from '../../class-types.macro';

        const style = ct("class", "other-class");

        const style2 = ct("other");
  
        ct(style, style2);
      `,
      output: `const style = "class other-class";
const style2 = "other";
style + (" " + style2);`,
    },
    "transform a function call with multiple identifiers and strings": {
      code: `
        import ct from '../../class-types.macro';

        const style = ct("class", "other-class");

        const style2 = ct("other");
  
        ct(style, "classic", style2, "flex", "border");
      `,
      output: `const style = "class other-class";
const style2 = "other";
"classic flex border" + (" " + (style + (" " + style2)));`,
    },
    "transform jsx string": {
      code: `
          import ct from '../../class-types.macro';
    
          <div className={ct("class", "other-class")} />;
        `,
      snapshot: true,
    },
    "transform jsx with variables": {
      code: `
          import ct from '../../class-types.macro';

          const style = ct("class", "other-class");
    
          <div className={ct("string", style)} />;
        `,
      snapshot: true,
    },
    "transform jsx with variables and ternary": {
      code: `
          import ct from '../../class-types.macro';

          const style = ct("class", "other-class");
    
          <div className={ct("string", style, true ? "this" : "that")} />;
        `,
      snapshot: true,
    },
    "transform jsx with variables and function call": {
      code: `
          import ct from '../../class-types.macro';

          const style = ct("class", "other-class");
    
          <div className={ct("string", style, getStyles())} />;
        `,
      snapshot: true,
    },
    "transform jsx with variables and function call to ct": {
      code: `
          import ct from '../../class-types.macro';

          const style = ct("class", "other-class");
    
          <div className={ct("string", style, ct("hey", style))} />;
        `,
      snapshot: true,
    },
    "transform jsx with ternary and function call to ct": {
      code: `
          import ct from '../../class-types.macro';

          const style = ct("class", "other-class");
    
          <div className={ct("string", style, something ? ct("hey") : ct("yo"))} />;
        `,
      snapshot: true,
    },
    "transform with MemberExpression": {
      code: `
          import ct from '../../class-types.macro';

          const colors = {red: "red-500"};

          const style = ct("class", "other-class");
    
          <div className={ct("string", colors["red"], something ? ct("hey") : ct("yo"))} />;
        `,
      snapshot: true,
    },
    "transform with || operator": {
      code: `
          import ct from '../../class-types.macro';

          const props = {className: "red-500"};
    
          <div className={ct("string", colors["red"], props.className || "")} />;
        `,
      snapshot: true,
    },
  },
});

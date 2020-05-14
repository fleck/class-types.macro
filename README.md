# ct.macro

Types for your CSS classes. This is a combination of a PostCSS plugin and babel macro.

## Setup
First, add this package:
```bash
yarn add ct.macro
```

You may need to add the babel macros plugin: https://github.com/kentcdodds/babel-plugin-macros/blob/master/other/docs/user.md Some projects such as create react app may already have this installed.

Next configure the PostCSS plugin, you'll want to add this after tailwind (or similar library), but before purgeCSS or any libraries that optimize your CSS builds.

```js
// postcss.config.js

module.exports = {
  plugins: [
    require('tailwindcss'),

    require('ct.macro').postcss(),

    require('autoprefixer'),
    ...process.env.NODE_ENV === 'production'
      ? [purgecss]
      : []
  ]
}
```

## TypeScript types for your tailwind classes

Confidently make changes to your tailwind config.

Ever make a change like this?
```js
// tailwind.config.js

module.exports = {
  theme: {
    extend: {
      colors: {
        blue: {
          '900': '#1e3656',
        }
      }
    }
  }
}
```
and find out later (in prod) you accidentally wiped out blue shades 100 - 800? this plugin guards against that!

![type error from missing class](assets/missing-class.png)

## Zero runtime cost

function calls are compiled to strings via babel macro, thanks Kent!

```jsx
// this:
<div className={cl("bg-blue-200", "flex", "mx-auto")} />

// gets compiled to this:
<div className="bg-blue-200 flex mx-auto" />
```

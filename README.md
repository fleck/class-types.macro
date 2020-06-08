# ct.macro

Types for your CSS classes. This is a combination of a PostCSS plugin and babel macro.

## Setup
Add this package:
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

### ESLint setup

Install `eslint-plugin-ct.macro`:

```bash
yarn add eslint-plugin-ct.macro -D
```

Add `ct.macro` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "ct.macro"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "ct.macro/class-order": 2
    }
}
```

## Usage

```jsx
import React from "react";
import ct from "ct.macro";

export default () => <div className={ct("bg-blue-200", "flex", "mx-auto")} />;
```

The first time you compile your CSS after adding the PostCSS plugin you'll notice 2 files were generated:

`@types/ct.macro/classNames.d.ts`

`@types/ct.macro/index.d.ts`

You can customize the path where these files are saved by passing a directory option in your postcss config.

```js
require('ct.macro').postcss({ directory: 'custom-directory/path/' }),
```

Treat these files as you would yarn.lock or package-json.lock, commit them when you have changes, but don't edit them by hand.

## Why use this library

### TypeScript types for your tailwind classes

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

### Zero runtime cost

function calls are compiled to strings via babel macro!

```jsx
// this:
<div className={cl("bg-blue-200", "flex", "mx-auto")} />

// gets compiled to this:
<div className="bg-blue-200 flex mx-auto" />
```

### Editor autocomplete
Never wonder again if z-index is incremented by 10 or 100!

![autocomplete suggestions for z index](assets/autocomplete.png)

### Auto-reorder classes via ESLint plugin/rule

![ESLint auto fix for class order](assets/autofix-class-order.gif)

### Better prettier formatting for long classes
this
```jsx
<div className="absolute overflow-x-hidden inset-x-0 w-11/12 mx-auto mt-5 overflow-y-auto bg-white outline-none border border-gray-300 border-solid rounded shadow-lg opacity-100" />
```

turns into this:

```jsx
<div
  className={ct(
    "w-11/12",
    "bg-white",
    "border-gray-300",
    "rounded",
    "border-solid",
    "border",
    "shadow-lg",
    "inset-x-0",
    "mx-auto",
    "mt-5",
    "opacity-100",
    "outline-none",
    "overflow-y-auto",
    "overflow-x-hidden",
    "absolute"
  )}
/>
```

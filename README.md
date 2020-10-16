# Laravel Mix Vue Css Modules

Add support for css module laravel mix.

## Installation

```
npm i laravel-mix-vue-css-modules
```

## Usage

First, VueCssModules must be enabled. Your `webpack.mix.js` could look like this:

```js
const mix = require("laravel-mix");
require("laravel-mix-vue-css-modules");

mix.vueCssModules();
```

Then, add the module attribute to your `<style>`

```css
<style module>
.red {
  color: red;
}
.bold {
  font-weight: bold;
}
</style>
```

You can then use it in your templates with a dynamic class binding:

```vue
<template>
  <p :class="$style.red">This should be red</p>
</template>
```

And that's it. you ready to go.

#### Opt-in Usage

If you only want to use CSS Modules in some of your Vue components, you can set `oneOf` to `true`

```js
mix.vueCssModules({ oneOf: true });
```

#### Pre-Processors

CSS Modules can be used along with other pre-processors. for now only **SCSS** and by default pre-processor is enable. to disable it set `preProcessor` to `false`

```js
mix.vueCssModules({ preProcessor: false });
```

#### Custom localIdentName

Default:

- use `'[path][name]__[local]` for development
- use `'[hash:base64]'` for production

```js
mix.vueCssModules({
  cssLoaderOptions: { localIdentName: "[path][name]__[local]" },
});
```

or you can use **react** or **discord** localIdentName

```js
mix.vueCssModules({ localIdentNameType: "react" });
```

#### Enable sourceMap

Default: `false`

```js
mix.vueCssModules({ cssLoaderOptions: { sourceMap: true } });
```

#### Set importLoaders

Default: `1`

```js
mix.vueCssModules({ cssLoaderOptions: { importLoaders: 2 } });
```

#### Exclude css

you may want some of your css exluded from generated class by css module.

```js
const getLocalIdent = require("css-loader/lib/getLocalIdent");

mix.vueCssModules({
  cssLoaderOptions: {
    getLocalIdent: (context, localIdentName, localName, options) => {
      return context.resourcePath.includes("x.scss")
        ? localName
        : getLocalIdent(context, localIdentName, localName, options);
    },
  },
});
```

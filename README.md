# Laravel Mix Vue Css Modules

Add support for css module laravel mix.

## Installation

```
npm install laravel-mix-vue-css-modules
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
  <p :class="$style.red">
    This should be red
  </p>
</template>
```

## Opt-in Usage

If you only want to use CSS Modules in some of your Vue components, you can set `oneOf` to `true`

```js
mix.vueCssModules({ oneOf: true });
```

#### Custom localIdentName

```js
// DEFAULT: '[local]_[hash:base64:8]'
mix.vueCssModules({ localIdentName: "[name]__[local]___[hash:base64:5]" });
```

#### Local mode

```js
// DEFAULT: global
mix.vueCssModules({ mode: "local" });
```

## Author

Aslam
FullStack Web developer

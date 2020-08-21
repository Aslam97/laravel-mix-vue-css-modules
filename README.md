# Laravel Mix Vue Css Modules

Add support for css module laravel mix.

## Installation

```
npm install laravel-mix-vue-css-modules --save
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

## Parameters

```js
// localIdentName: '[local]_[hash:base64:8]' // default
// mode
mix.vueCssModules({
  localIdentName: "[name]__[local]___[hash:base64:5]",
  mode: "local",
});
```

## Author

Aslam
FullStack Web developer

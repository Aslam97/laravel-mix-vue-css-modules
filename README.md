# Laravel Mix Vue Css Modules

Add supprt for css module.

## Installation

```
npm install laravel-mix-vue-css-modules --save
```

or

```
yarn add laravel-mix-vue-css-modules
```

## Usage

Your `webpack.mix.js` could look like this:

```js
const mix = require("laravel-mix");
require("laravel-mix-vue-css-modules");

mix.vueCssModules();
```

custom localIdentName

```js
// DEFAULT localIdentName: '[local]_[hash:base64:8]'
mix.vueCssModules({
  localIdentName: "[name]__[local]___[hash:base64:5]",
});
```

switch mode

```js
// default global
mix.vueCssModules({ mode: "local" });
```

## Author

Aslam
FullStack Web developer

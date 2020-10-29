<h1 align="center">
    Laravel Mix Vue Css Modules
    <br>
    <a href="https://www.npmjs.com/package/laravel-mix-vue-css-modules"><img src="https://img.shields.io/npm/v/laravel-mix-vue-css-modules.svg?style=for-the-badge" alt="npm" /></a> <a href="https://www.npmjs.com/package/laravel-mix-vue-css-modules"><img src="https://img.shields.io/npm/dt/laravel-mix-vue-css-modules.svg?style=for-the-badge" alt="npm" /></a>
</h1>

Add support for css module laravel mix. **CSS, SCSS, LESS & STYLUS**

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

#### Custom Injectname

```js
<style module="$cssA">
  /* identifiers injected as $cssA */
</style>

<style module="$cssB">
  /* identifiers injected as $cssB */
</style>
```

## Pre-Processors

By default all pre-processors are disabled.

#### For Scss

```js
mix.vueCssModules({ preProcessor: { scss: true } });
```

#### For Less

`npm i less less-loader --save-dev`

then set `less` to `true`

```js
mix.vueCssModules({ preProcessor: { less: true } });
```

#### For Stylus

`npm i stylus stylus-loader --save-dev`

then set `stylus` to `true`

```js
mix.vueCssModules({ preProcessor: { stylus: true } });
```

#### Custom localIdentName

Default:

-   `[path][name]__[local]` for development
-   `[hash:base64]` for production

```js
mix.vueCssModules({
    cssLoaderOptions: { localIdentName: "[path][name]__[local]" }
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

#### Exclude

```js
mix.vueCssModules({ exclude: [path.resolve(__dirname, "node-modules")] });
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
        }
    }
});
```

## Example

```vue
<script>
export default {};
</script>

<template>
    <div>
        <span class="blue">css scoped</span>

        <span :class="$css.blue">css module</span>

        <span class="red">scss scoped</span>

        <span :class="$scss.red">scss module</span>

        <span class="green">less scoped</span>

        <span :class="$less.green">less module</span>

        <span class="indigo">stylus scoped</span>

        <span :class="$stylus.indigo">stylus module</span>
    </div>
</template>

<style scoped>
.blue {
    color: blue;
}
</style>

<style module="$css">
.blue {
    color: blue;
}
</style>

<style lang="scss" scoped>
@mixin my-color($color) {
    color: $color;
}

.red {
    @include my-color(red);
}
</style>

<style lang="scss" module="$scss">
@mixin my-color($color) {
    color: $color;
}

.red {
    @include my-color(red);
}
</style>

<style lang="less" scoped>
@color: green;

.green {
    color: @color;
}
</style>

<style lang="less" module="$less">
@color: green;

.green {
    color: @color;
}
</style>

<style lang="stylus" scoped>
my-color()
    color: arguments

.indigo
    my-color: indigo
</style>

<style lang="stylus" module="$stylus">
my-color()
    color: arguments

.indigo
    my-color: indigo
</style>
```

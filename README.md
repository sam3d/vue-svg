# vue-svg [![npm version](https://badge.fury.io/js/vue-cli-plugin-svg.svg)](https://badge.fury.io/js/vue-cli-plugin-svg) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

_Super simple svg loading module for Vue.js_

(actual npm package is [vue-cli-plugin-svg](https://www.npmjs.com/package/vue-cli-plugin-svg))

## Introduction

`vue-svg` allows you to import `.svg` files in multiple ways depending on the [resource query](https://webpack.js.org/configuration/module/#rule-resourcequery) you provide. Currently, this allows you to do the following:

- `file.svg` - normal import using `file-loader`
- `file.svg?data` - base64 data url import using `url-loader`
- `file.svg?inline` - inline import using `vue-svg-loader`
- `file.svg?sprite` - import using `svg-sprite-loader` **(alpha implementation)**

## Installation

Using the new [Vue CLI 3](https://cli.vuejs.org/), it's as simple as navigating to your project and running:

```console
$ vue add svg
```

That's it! You're ready to go!

## Usage

The usage examples are documented as:

```html
<!-- Vue.js code -->
```

```html
<!-- Outputted html -->
```

### Standard external import

_Import normally as an external resource using `file-loader`_

```html
<template>
  <img src="@/assets/vue-logo.svg" />
</template>
```

```html
<img src="/img/vue-logo.938241fe.svg" />
```

### Inline base64 url

_Inline as a URL (no external requests) using `url-loader`_

```html
<template>
  <img src="@/assets/vue-logo.svg?data" />
</template>
```

```html
<img src="data:image/svg+xml;base64,P...2h913j1g18h98hr" />
```

### Inline svg element

_Inline as an actual svg element using `vue-svg-loader`_

```html
<template>
  <VueLogo />
</template>

<script>
  import VueLogo from "@/assets/vue-logo.svg?inline";

  export default {
    components: {
      VueLogo
    }
  };
</script>
```

```html
<svg xmlns="http://www.w3.org/2000/svg"><path></path></svg>
```

### Sprite import

```html
<template>
  <svg><use xlink:href="#vue-logo"></use></svg>
</template>

<script>
  import "@/assets/vue-logo.svg?sprite";
</script>
```

```html
<!-- Coming shortly -->
```

## Configuration

You can provide options to all of the loaders used in using the `vue.config.js` `pluginOptions` field:

```javascript
// vue.config.js

module.exports = {
  pluginOptions: {
    svg: {
      inline: {}, // Pass options to vue-svg-loader
      data: {}, // Pass options to url-loader
      sprite: {}, // Pass options to svg-sprite-loader
      external: {} // Pass options to file-loader
    }
  }
};
```

You can provide as many options as you like, or nothing at all. You don't have to configure options, it will use some standard defaults.

You can also customise the resource queries for each type that doesn't get passed as a loader options (other than `external`, which doesn't use a resourceQuery):

```javascript
// vue.config.js

module.exports = {
  pluginOptions: {
    svg: {
      // You can change this
      inline: { resourceQuery: /inline/ }
    }
  }
};
```

### Standard defaults

By default, `file-loader` will inherit the standard configuration from `vue-cli` so that behaves exactly the same.

`vue-svg-loader` by default will _not_ use `svgo`. This is because it can cause more problems than it solves generally, though this can be easily re-enabled. Check the [`vue-svg-loader` documentation](https://vue-svg-loader.js.org/) for more info.

## Contributing

As this loader attempts to abstract webpack configuration from the process and make it easier to use multiple svg loaders, any contributions that add more svg loader methods to the configuration will be accepted wholeheartedly!

Also I'll be actively maintaining this project so if you'd rather just make a request for a loader or a feature; I'd be happy to take a look and see what I can do myself :)

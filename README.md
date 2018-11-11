# vue-svg [![npm version](https://badge.fury.io/js/vue-cli-plugin-svg.svg)](https://badge.fury.io/js/vue-cli-plugin-svg)
_Super simple svg loading module for Vue.js_

(actual npm package is [vue-cli-plugin-svg](https://www.npmjs.com/package/vue-cli-plugin-svg))

## Introduction

`vue-svg` allows you to import `.svg` files in multiple ways depending on the [resource query](https://webpack.js.org/configuration/module/#rule-resourcequery) you provide. Currently, this allows you to do the following:

- `file.svg` - normal import using `file-loader`
- `file.svg?data` - base64 data url import using `url-loader`
- `file.svg?inline` - inline import using `vue-svg-loader`

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
	<img src="@/assets/vue-logo.svg">
</template>
```

```html
<img src="/img/vue-logo.938241fe.svg">
```

### Inline base64 url

_Inline as a URL (no external requests) using `url-loader`_

```html
<template>
	<img src="@/assets/vue-logo.svg?data">
</template>
```

```html
<img src="data:image/svg+xml;base64,P...2h913j1g18h98hr">
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
}
</script>
```

```html
<svg xmlns="http://www.w3.org/2000/svg"><path></path></svg>
```

## Contributing
As this loader attempts to abstract webpack configuration from the process and make it easier to use multiple svg loaders, any contributions that add more svg loader methods to the configuration will be accepted wholeheartedly!

Also I'll be actively maintaining this project so if you'd rather just make a request for a loader or a feature; I'd be happy to take a look and see what I can do myself :)

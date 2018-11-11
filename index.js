const _ = require("lodash");

const defaults = {
	inline: { resourceQuery: /inline/, svgo: false }, // Options for vue-svg-loader
	sprite: { resourceQuery: /sprite/, extract: false }, // Options for svg-sprite-loader
	data: { resourceQuery: /data/ }, // Options for url-loader
	external: {} // Options for file-loader
};

/**
 * The main entry point for the module.
 * @param  {PluginAPI} api     An instance of the PluginAPI
 * @param  {Object}    options All options specified in vue.config.js
 */
function handler(api, options) {
	options = parseOptions(options);
	api.chainWebpack(config => setup(config, options));
}

/**
 * Perform the main setup of the svg rule parsing and rewriting. This uses the
 * chainWebpack API modify the required rules.
 * @param  {ChainWebpack} config  An instance of ChainWebpack
 * @param  {Object}       options The svg options from the vue.config.js
 */
function setup(config, options) {
	const rule = config.module.rule("svg"); // Find the svg rule

	const fileLoaderOptions = rule.use("file-loader").get("options"); // Get the file loader options
	options.external = _.merge(fileLoaderOptions, options.external); // Make sure we save the file loader options
	options.sprite = _.merge({ spriteFilename: fileLoaderOptions.name }, options.sprite); // Use file loader options for sprite name

	rule.uses.clear(); // Clear out existing uses of the svg rule

	const query = {}; // Keep track of the resource queries
	for (option in options) {
		if (!options[option].resourceQuery) continue; // Skip if no query
		query[option] = options[option].resourceQuery; // Get the query
		delete options[option].resourceQuery; // Delete the field (to prevent passing it as a loader option)
	}

	rule
		.oneOf("inline").resourceQuery(query.inline).use("vue-svg-loader").loader("vue-svg-loader").options(options.inline).end().end()
		.oneOf("sprite").resourceQuery(query.sprite).use("svg-sprite-loader").loader("svg-sprite-loader").options(options.sprite).end().end()
		.oneOf("data").resourceQuery(query.data).use("url-loader").loader("url-loader").options(options.data).end().end()
		.oneOf("external").use("file-loader").loader("file-loader").options(options.external).end().end();
}

function parseOptions({ pluginOptions = {} }) {
	let { svg } = pluginOptions; // Get the svg configuration
	if (typeof svg === "object") svg = _.merge(defaults, svg); // If exists, merge with defaults
	else if (!svg) svg = defaults; // If no config set, use defaults
	else throw new TypeError(`pluginOptions.svg is of type "${typeof svg}", which is not a valid configuration type`);

	return svg;
}

module.exports = handler;

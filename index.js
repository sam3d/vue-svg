/**
 * The main entry point for the module.
 * @param  {PluginAPI} api     An instance of the PluginAPI
 * @param  {Object}    options All options specified in vue.config.js
 */
function handler(api, options) {
	api.chainWebpack(setup);
}

/**
 * Perform the main setup of the svg rule parsing and rewriting. This uses the
 * chainWebpack API modify the required rules.
 * @param  {ChainWebpack} config An instance of ChainWebpack
 */
function setup(config) {
	const rule = config.module.rule("svg"); // Find the svg rule
	const options = rule.use("file-loader").get("options"); // Make sure we save the file loader options
	rule.uses.clear(); // Clear out existing uses of the svg rule

	rule
		.oneOf("inline").resourceQuery(/inline/).use("vue-svg-loader").loader("vue-svg-loader").options({ svgo: false }).end().end()
		.oneOf("data").resourceQuery(/data/).use("url-loader").loader("url-loader").end().end()
		.oneOf("external").use("file-loader").loader("file-loader").options(options).end().end();
}

module.exports = handler;

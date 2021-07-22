const _ = require("lodash");

/**
 * The default options for the package. These are defined and configured properly
 * in the vue.config.js file under "pluginOptions.svg".
 * @type {Object}
 */
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
module.exports = function handler(api, options) {
  options = parseOptions(options);
  api.chainWebpack(config => setup(config, options));
};

/**
 * Perform the main setup of the svg rule parsing and rewriting. This uses the
 * chainWebpack API modify the required rules.
 * @param  {ChainWebpack} config  An instance of ChainWebpack
 * @param  {Object}       options The svg options from the vue.config.js
 */
function setup(config, options) {
  const rule = config.module.rule("svg"); // Find the svg rule

  /*
   * Let's use the file loader option defaults for the svg loader again. Otherwise
   * we'll have to set our own and it's no longer consistent with the changing
   * vue-cli.
   */
  const fileLoaderOptions = rule.use("file-loader").get("options"); // Get the file loader options
  options.external = _.merge(fileLoaderOptions, options.external); // Make sure we save the file loader options

  // Use file loader options for sprite name
  options.sprite = _.merge(
    { spriteFilename: fileLoaderOptions.name },
    options.sprite
  );

  rule.uses.clear(); // Clear out existing uses of the svg rule
  const query = parseResourceQuery(options); // Get the resource queries

  rule
    .oneOf("inline")
    .resourceQuery(query.inline)
    .use('vue-loader')
    .loader('vue-loader-v16')
    .end()
    .use("vue-svg-loader")
    .loader("vue-svg-loader")
    .options(options.inline);

  rule
    .oneOf("sprite")
    .resourceQuery(query.sprite)
    .use("svg-sprite-loader")
    .loader("svg-sprite-loader")
    .options(options.sprite);

  rule
    .oneOf("data")
    .resourceQuery(query.data)
    .use("url-loader")
    .loader("url-loader")
    .options(options.data);

  rule
    .oneOf("external")
    .use("file-loader")
    .loader("file-loader")
    .options(options.external);
}

function parseOptions({ pluginOptions = {} }) {
  let { svg } = pluginOptions; // Get the svg configuration

  // Merge svg options if object, otherwise just use defaults
  if (typeof svg === "object") svg = _.merge(defaults, svg);
  else if (!svg) svg = defaults;
  else {
    throw new TypeError(
      `pluginOptions.svg is of type "${typeof svg}", which is not a valid configuration type`
    );
  }

  return svg;
}

/**
 * Processes the options object passed to the app by extracting the resource query
 * options and returning them so that they can be used later.
 * @param  {object} options The plugin options object
 * @return {object}         An object containing the resource queries and their relevant config names
 */
function parseResourceQuery(options) {
  const query = {};

  for (option in options) {
    if (!options[option].resourceQuery) continue; // Skip if no query
    query[option] = options[option].resourceQuery; // Get the query
    delete options[option].resourceQuery; // Delete the field (to prevent passing it as a loader option)
  }

  return query;
}

const webpack = require('webpack');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const isCI = require('is-ci');

function makePluginList(env) {
  const plugins = [];

  if (!isCI) {
    const plugins_notCI = [
      new webpack.ProgressPlugin(),
    ];
    for (const p of plugins_notCI) { plugins.push(p); }
  }

  if (env === 'development' && isCI === false) {
    const plugins_development = [
      new ForkTsCheckerWebpackPlugin({
        tslint: false,
        useTypescriptIncrementalApi: true
      }),
      new ForkTsCheckerNotifierWebpackPlugin({
        title: 'TypeScript',
        excludeWarnings: false,
      }),
    ]
    for (const p of plugins_development) { plugins.push(p); }
  }

  return plugins;
}

function makeTsLoaderOptions(env) {
  return {
    'transpileOnly': env === 'development' ? true : false,
    'experimentalWatchApi': env === 'development' ? true : false,
  };
}

module.exports.makePluginList = makePluginList;
module.exports.makeTsLoaderOptions = makeTsLoaderOptions;

/**
 * Created by JackieWu on 16/4/20.
 */
'use strict';
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const files = require('./entryfile');
const config = require('../server/config');
// npm 指令
const ENV = process.env.NODE_ENV;

const webpackConfig = require('./webpack-config');

webpackConfig.entry = {
  common: [
    './client/less/common.less',
    './node_modules/normalize.css/normalize.css',
    './node_modules/antd/dist/antd.less'
  ],
  ...files,
};

webpackConfig.output = {
  path: path.resolve(process.cwd(), 'dist'),
  filename: `[name].js`,
  libraryTarget: "window",
  library: "RApp",
};

if (ENV === 'development') {

  const compiler = webpack(webpackConfig);

  const server = new WebpackDevServer(compiler, {
    inline: true,
    historyApiFallback: true,
    stats: { colors: true },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "X-Requested-With",
      "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
    }
  });
  //
  server.listen(config.clientPort);
} else {
  webpackConfig.plugins.push(
    new UglifyJsPlugin(),
  );
  const compiler = webpack(webpackConfig);
  compiler.run();
}
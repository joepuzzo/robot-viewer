const { merge } = require('webpack-merge');
const common = require('./webpack.common.cjs');

module.exports = merge(common, {
  devtool: 'source-map',
  mode: 'development',
  devServer: {
    contentBase: './build',
    port: 9000,
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
  }
});
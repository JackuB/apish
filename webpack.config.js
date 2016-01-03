var webpack = require('webpack');
var minimize = process.argv.indexOf('--no-minimize') === -1 ? true : false;
var plugins = minimize
  ? [new webpack.optimize.UglifyJsPlugin({ minimize: true })]
  : [];

module.exports = {
  entry: './src/nockmock.js',
  output: {
    path: './dist',
    filename: minimize ? 'nockmock.min.js' : 'nockmock.js',
    libraryTarget: 'umd',
    library: 'nockmock'
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel'
    }]
  },
  plugins: plugins
};

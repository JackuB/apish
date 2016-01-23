module.exports = {
  entry: './src/apish.js',
  output: {
    path: './dist',
    filename: 'apish.js',
    libraryTarget: 'umd',
    library: 'apish'
  },
  module: {
    preLoaders: [
        { test: /\.json$/, loader: 'json' },
    ],
    loaders: [{
      test: /\.js?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel'
    }]
  },
  target: 'node'
};

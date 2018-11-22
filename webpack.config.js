const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MD5HashPlugin = require('webpack-md5-hash');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const path = require('path');
const { ENV, DEV, TEST, PROD } = require('./webpack.env');

const outDir = path.resolve('bundle');
const localComponents = /@storefront/;

module.exports = {
  entry: './presets/index',

  devtool: 'source-map',

  output: {
    filename: `storefront.js`,
    sourceMapFilename: `storefront.map.js`,
    path: outDir,
  },

  resolve: {
    // mainFields: ['browser', 'module:esnext', 'module', 'main']
    alias: {
      riot: path.resolve(__dirname, 'node_modules/riot/riot+compiler.js')
    }
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new MD5HashPlugin(),
    new DefinePlugin({
      'process.env': {
        ENV: `'${ENV}'`,
        NODE_ENV: `'${ENV}'`
      }
    }),
  ].concat(ENV === PROD ? [new UglifyJSPlugin({ sourceMap: true })] : []),

  module: {
    rules: [{
      test: path.resolve(__dirname, 'presets', 'core.js'),
      use: { loader: 'expose-loader', options: 'storefront' }
    }, {
      resource: [
        // /node_modules\/@storefront\/.*\.js$/,
        { test: /\.js$/, exclude: [/node_modules/] }
      ],
      loader: 'babel-loader'
    }, {
      enforce: 'pre',
      test: /\.js$/,
      loader: 'source-map-loader'
    }, {
      test: /\.html$/,
      include: localComponents,
      loader: 'html-loader'
    }, {
      test: /\.css$/,
      include: localComponents,
      use: [
        'to-string-loader',
        { loader: 'css-loader', options: { minimize: ENV === PROD } }
      ]
    }]
  }
};

/* eslint-env node, es6 */
/* eslint-disable no-console */
/**
 * @module webpack.config
 * @see https://webpack.js.org/configuration/
 * @since 2019.02.07, 22:56
 * @version 2019.02.09, 02:52
 */

const path = require('path');

// const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractCssPlugin = require('mini-css-extract-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const buildPath = path.resolve('./react-build');

module.exports = {

  context: __dirname,

  entry: {
    extra: './src/extra',
    main: './src/main',
  },

  // NOTE: Sourcemaps in dev-tools mode...
  devtool: 'cheap-module-source-map',

  /*{{{*/resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'app'),
    ],
    // TODO: Add '.ts', '.tsx'?
    extensions: ['.js', '.json', '.jsx', '.css'],
  },/*}}}*/

  /*{{{*/output: {
      path: buildPath,
      filename: '[name]-[hash:8].js',
      // chunkFilename: '[name].js',
      // sourceMapFilename: '[file].map',
  },/*}}}*/

  /*{{{*/devServer: {
    contentBase: path.join(__dirname, 'src'),
    compress: true,
    port: 8080,
  },/*}}}*/

  /*{{{*/module: {
    rules: [
      /*{{{ jsx */{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // cacheable: true,
        query: {
            retainLines: true,
            cacheDirectory: true,
        },
      },/*}}}*/
      /*{{{ css */{
        test: /\.css$/,
        // loader: 'css-loader!csso-loader',
        use: [
          ExtractCssPlugin.loader,
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              sourceMap: true,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('autoprefixer')({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
                require('postcss-csso'),
              ],
            },
          },
        ],
      },/*}}}*/
    ],
  },/*}}}*/

  /*{{{*/plugins: [
    // new webpack.DefinePlugin({
    //   // Macro substitutions?
    //   'process.env': {
    //     testVar: JSON.stringify('test'), // ???
    //     // NODE_ENV: JSON.stringify('development'), // Automatically passed by webpack
    //   }
    // }),
    new CleanWebpackPlugin(
      [
        path.join(buildPath, '**/*'),
      ],
      {
        exclude: ['.gitkeep'],
        verbose: true,
        beforeEmit: true,
        // dry: false,
      }
    ),
    new HtmlWebPackPlugin({
      inject: true,
      template: './src/local-public/index.html',
      // filename: './index.html',
    }),
    new BundleTracker({
      filename: './webpack-tracker.json',
    }),
    new ExtractCssPlugin({
      filename: '[name]-[contenthash:8].css',
    }),
    // new BundleAnalyzerPlugin({
    //   // see: https://github.com/webpack-contrib/webpack-bundle-analyzer
    //   analyzerMode: 'static',
    //   openAnalyzer: false,
    //   reportFilename: 'stats.html',
    //   generateStatsFile: true,
    //   statsOptions: {
    //     // see: https://webpack.js.org/configuration/stats/
    //     // hash: false,
    //     source: false,
    //   },
    // }),
  ],/*}}}*/

  /*{{{*/optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '-',
      name: true,
      cacheGroups: {
        // vendors: false,
        vendors: {
          name: 'vendor',
          // chunks: 'all',
          test: /node_modules/,
          // test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        commons: {
          name: 'common',
          chunks: 'initial',
          minChunks: 2,
          priority: -20,
        },
        // default: {
        //   minChunks: 2,
        //   priority: -20,
        //   reuseExistingChunk: true,
        // },
      },
    },
  },/*}}}*/

};
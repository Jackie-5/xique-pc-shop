/**
 * Created by Jackie.Wu on 2017/8/24.
 */
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackBar = require('webpackbar');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  resolve: {
    extensions: ['*', '.js', '.jsx', 'json'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new WebpackBar(),
  ],
  externals: {
    'lodash': 'lodash',
    'axios': 'axios',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'dayjs': 'dayjs'
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: path.resolve(process.cwd(), 'node_modules'),
        use: ['babel-loader'],
      }, {
        test: /\.(le|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')({ browsers: ['last 2 versions'] }),
              ]
            }
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: require(path.join(process.cwd(), 'theme')),
              javascriptEnabled: true,
            },
          },
        ],
      }, {
        test: /\.(jpg|jpeg|gif|png)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name]-[hash].[ext]',
              publicPath: process.env.NODE_ENV === 'development' ? '' : '../'
            }
          }
        ]
      }, {
        test: /\.(eot|svg|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name]-[hash].[ext]',
              publicPath: process.env.NODE_ENV === 'development' ? '' : '../'
            }
          }
        ]
      }]
  },
  optimization: {
    splitChunks: {
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      cacheGroups: {
        vendor: {
          name: "vendor",
          minSize: 1000,
          minChunks: 4,
          chunks: "initial",
        }
      },
    }
  },
};
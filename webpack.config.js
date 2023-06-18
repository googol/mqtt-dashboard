const path = require('node:path')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const ReactRefresh = require('react-refresh/babel')

module.exports = {
  entry: './src/main.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/u,
        exclude: /node_modules/u,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [ReactRefresh],
            },
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Dashboard',
      scriptLoading: 'module',
      template: 'src/index.html',
    }),
    new NodePolyfillPlugin(),
    new ReactRefreshWebpackPlugin(),
  ],
  devServer: {
    static: './dist',
    hot: true,
  },
}

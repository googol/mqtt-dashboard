const path = require('node:path')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const ReactRefresh = require('react-refresh/babel')

const isDev = (argv) => argv.mode === 'development'

const publicPath = process.env.PUBLIC_PATH

function* getBabelPlugins(argv) {
  if (isDev(argv)) {
    yield ReactRefresh
  }
}

function* getWebpackPlugins(argv) {
  yield new HtmlWebpackPlugin({
    title: 'Dashboard',
    scriptLoading: 'module',
    template: 'src/index.html',
  })
  yield new NodePolyfillPlugin()
  if (isDev(argv)) {
    yield new ReactRefreshWebpackPlugin()
  }
}

module.exports = (env, argv) => ({
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
              plugins: Array.from(getBabelPlugins(argv)),
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
    publicPath: publicPath === undefined ? '/' : publicPath,
  },
  plugins: Array.from(getWebpackPlugins(argv)),
  devServer: {
    static: './dist',
    hot: true,
  },
})

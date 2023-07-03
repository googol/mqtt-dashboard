const path = require('node:path')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const ReactRefresh = require('react-refresh/babel')
const WorkboxPlugin = require('workbox-webpack-plugin')

const isDev = (argv) => argv.mode === 'development'

const publicPath = process.env.PUBLIC_PATH

function* getBabelPlugins(argv) {
  if (isDev(argv)) {
    yield ReactRefresh
  }
}

function* getWebpackPlugins(argv) {
  if (!isDev(argv)) {
    yield new MiniCssExtractPlugin({
      filename: 'public/[name].[contenthash].css',
    })
  }
  yield new HtmlWebpackPlugin({
    title: 'Dashboard',
    scriptLoading: 'module',
    template: 'src/index.html',
  })
  yield new NodePolyfillPlugin()
  yield new CopyPlugin({
    patterns: [
      {
        from: 'public/manifest.webmanifest',
        to: '.',
      },
      {
        from: 'public/*.png',
        to: './[path]/[name].[contenthash][ext]',
      },
    ],
  })
  if (!isDev(argv)) {
    yield new WorkboxPlugin.GenerateSW({
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    })
  }
  if (isDev(argv)) {
    yield new ReactRefreshWebpackPlugin()
  }
}

function* getTypescriptLoaders(argv) {
  yield {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
      plugins: Array.from(getBabelPlugins(argv)),
    },
  }
  yield {
    loader: 'ts-loader',
  }
}

function* getCssLoaders(argv) {
  if (isDev(argv)) {
    yield {
      loader: 'style-loader',
    }
  } else {
    yield MiniCssExtractPlugin.loader
  }
  yield {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
    },
  }
  yield {
    loader: 'postcss-loader',
  }
}

module.exports = (env, argv) => ({
  entry: './src/main.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/u,
        exclude: /node_modules/u,
        use: Array.from(getTypescriptLoaders(argv)),
      },
      {
        test: /\.css$/u,
        use: Array.from(getCssLoaders(argv)),
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.[contenthash].js',
    chunkFilename: '[id].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: publicPath === undefined ? '/' : publicPath,
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: Array.from(getWebpackPlugins(argv)),
  devServer: {
    static: './dist',
    hot: true,
  },
})

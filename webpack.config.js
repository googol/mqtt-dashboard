const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const ReactRefresh = require('react-refresh/babel')
const WorkboxPlugin = require('workbox-webpack-plugin')

const isDev = (argv) => argv.mode === 'development'
const distDirectory = (argv) =>
  path.resolve(__dirname, isDev(argv) ? 'dist-dev' : 'dist')

const publicPath =
  process.env.PUBLIC_PATH === undefined ? '/' : process.env.PUBLIC_PATH

module.exports = (env, argv) => ({
  entry: {
    main: {
      import: './src/main.tsx',
    },
  },
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
    filename: 'assets/[name].[contenthash].js',
    chunkFilename: '[id].[contenthash].js',
    path: distDirectory(argv),
    publicPath,
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: Array.from(getWebpackPlugins(argv)),
  devServer: {
    static: distDirectory(argv),
    hot: true,
    watchFiles: {
      paths: ['src/**/*', 'public/**/*'],
    },
  },
})

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

function* getBabelPlugins(argv) {
  if (isDev(argv)) {
    yield ReactRefresh
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

function* getWebpackPlugins(argv) {
  if (!isDev(argv)) {
    yield new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css',
    })
  }
  yield new HtmlWebpackPlugin({
    title: 'Dashboard',
    scriptLoading: 'module',
    filename: 'index.html',
    template: 'src/index.html',
  })
  yield new NodePolyfillPlugin()

  const logoFile = './assets/home_automation_512.png'
  yield new FaviconsWebpackPlugin({
    logo: logoFile,
    prefix: 'assets/',
    inject: true,
    favicons: {
      orientation: 'portrait',
      path: 'assets/',
      appShortName: 'Kotidashboard',
      appName: 'Kotidashboard',
      appDescription: null,
      developerURL: null,
      start_url: '/',
      display: 'standalone',
      background: '#ffffff',
      theme_color: '#000000',
      scope: '/',
      cacheBustingQueryParam: `v=${getCacheBustingValue(logoFile)}`,
    },
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

function getCacheBustingValue(filePath) {
  const fileBuffer = fs.readFileSync(filePath)
  const hash = crypto.createHash('sha256')
  hash.update(fileBuffer)
  return hash.digest().toString('base64url')
}

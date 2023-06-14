const path = require('node:path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/u,
        use: 'ts-loader',
        exclude: /node_modules/u,
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
    }),
  ],
  devServer: {
    static: './dist',
    hot: true,
  },
}

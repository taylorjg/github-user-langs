/* eslint-env node */

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const packageJson = require('./package.json')

const serverPublic = path.join(__dirname, 'src', 'server', 'public')

module.exports = {
  entry: [
    // 'babel-polyfill',
    './src/client/index.js'
  ],
  output: {
    path: serverPublic,
    filename: 'bundle.js',
  },
  plugins: [
    new CopyWebpackPlugin([
      { context: './src/client', from: '*.{html,css,gif}' }//,
      // { context: './src/client', from: '*.css' },
      // { context: './src/client', from: '*.gif' }
    ]),
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
      version: packageJson.version
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  devtool: 'source-map',
  mode: 'development',
  devServer: {
    contentBase: serverPublic,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
}

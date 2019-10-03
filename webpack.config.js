/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const ENTRY_PATH = path.resolve(__dirname, 'src/scripts/main.js');
const BUILD_PATH = path.resolve(__dirname, 'public');
const SHADER_PATH = path.resolve(__dirname, 'src/shaders');

const config = {
  devtool: 'cheap-module-eval-source-map',
  entry: ENTRY_PATH,
  mode: 'development',
  output: {
    publicPath: '/',
    filename: '[name].js',
    path: BUILD_PATH
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|lib)/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'eslint-loader'
          }
        ]
      },
      {
        test: /\.(frag|vert|glsl)$/,
        exclude: /node_modules/,
        include: SHADER_PATH,
        use: ['raw-loader', 'glslify-loader']
      }
      // {
      //     test: /\.less$/,
      //     use: ['style-loader', 'css-loader', 'less-loader']
      // }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
};

module.exports = config;

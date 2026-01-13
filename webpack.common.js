const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './js/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: 'js/[name].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'css', to: 'css' },
        { from: 'img', to: 'img' },
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'icon.png', to: 'icon.png' },
        { from: 'icon.svg', to: 'icon.svg' },
      ],
    }),
  ],
};

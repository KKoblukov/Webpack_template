const path = require('path');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function generateHtmlPages(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
    });
  });
}

const htmlPlugins = generateHtmlPages('./src/html/views');

module.exports = {
  entry: [
    // Точки входа
    './src/js/index.js',
    './src/scss/style.scss',
  ],
  output: {
    // Куда собирать бандл, относительно dist/
    filename: './js/bundle.js',
  },
  devtool: 'source-map', // Указываем делать карты исходного кода
  module: {
    rules: [
      // набор правил, для обработки конкретных типов файлов
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/js'), // Абсолютный путь
        use: {
          loader: 'babel-loader',
          options: {
            presets: 'env',
          },
        },
      },
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, 'src/scss'),
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                minimize: true,
                url: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        }),
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src/html/includes'),
        use: ['raw-loader'],
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: './css/style.bundle.css', // Итоговый css файл
      allChunks: true,
    }),
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      {
        from: './src/favicon',
        to: './favicon',
      },
      {
        from: './src/img',
        to: './img',
      },
      {
        from: './src/fonts',
        to: './fonts',
      },
      {
        from: './src/assets',
        to: './assets',
      },
    ]),
  ].concat(htmlPlugins),
};

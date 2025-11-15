const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

const mode = process.env.NODE_ENV || "development";
const devMode = mode === "development";
const target = devMode ? "web" : "browserslist";
const devtool = devMode ? "source-map" : undefined;

module.exports = {
  mode,
  target,
  devtool,
  devServer: {
    port: 3000,
    open: true,
    hot: true,
  },
  // путь до файла с которого начинается приложение
  entry: ["@babel/polyfill", path.resolve(__dirname, "src", "index.js")],
  output: {
    // название файла сборки
    path: path.resolve(__dirname, "dist"),
    // параметр для очистки папки
    clean: true,
    // путь сборки
    filename: "[name].[contenthash].js",
  },
  plugins: [
    // webpack создаёт отдельный html-файл
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
    }),
    // webpack создаёт отдельный css-файл
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
    // webpack добавляет иконку для страницы
    new FaviconsWebpackPlugin({
      logo: "./src/images/icon.png",
      mode: "webapp",
      devMode: "webapp",
      prefix: "assets/favicons/",
      cashe: true,
    }),
  ],
  module: {
    rules: [
      // загрузчик html
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      // загрузчик css/sass/scss
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          // создает узлы `style` из строк JS
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          // переводит CSS в CommonJS
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("postcss-preset-env")],
              },
            },
          },
          // компилирует Sass в CSS
          "sass-loader",
        ],
      },
      // загрузчик babel
      {
        test: /\.(?:js|mjs|cjs)$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
    ],
  },
};

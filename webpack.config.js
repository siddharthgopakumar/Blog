const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPugPlugin = require("html-webpack-pug-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";
console.log(path.resolve(__dirname, "public"));

const configs = [
  {
    entry: { home: "./client/home/home.ts" },
    output: {
      filename: isProduction
        ? "./assets/js/[name].[contenthash].js"
        : "./assets/js/[name].js",
      path: path.resolve(__dirname, "public"),
      publicPath: "/",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./templates/home/index.pug",
        filename: "../views/home/index.pug",
        minify: false,
      }),
      new HtmlWebpackPugPlugin(),
    ],
  },
  {
    entry: { feed: "./client/feed/index.tsx" },
    output: {
      filename: isProduction
        ? "./assets/js/[name].[contenthash].js"
        : "./assets/js/[name].js",
      path: path.resolve(__dirname, "public"),
      publicPath: "/",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./templates/feed/index.pug",
        filename: "../views/feed/index.pug",
        minify: false,
      }),
      new HtmlWebpackPugPlugin(),
    ],
  },
];

module.exports = () => {
  return configs.map((config) => {
    if (isProduction) {
      config.mode = "production";
    } else {
      config.mode = "development";
    }
    const plugins = [
      ...config.plugins,
      ...[
        ...config.plugins,
        ...(isProduction
          ? [
              new MiniCssExtractPlugin({
                filename: "./assets/css/home.[contenthash].css",
              }),
            ]
          : []),
        new LodashModuleReplacementPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
      ],
    ];
    const entry = config.entry;
    const output = config.output;

    return {
      entry,
      output,
      ...{
        devServer: {
          open: true,
          host: "localhost",
        },
        module: {
          rules: [
            {
              test: /\.(js|jsx)$/,
              use: "babel-loader",
              exclude: /node_modules/,
            },
            {
              test: /\.css$/,
              use: [
                isProduction
                  ? {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                        publicPath: "/",
                      },
                    }
                  : "style-loader",
                "css-loader",
              ],
            },
            {
              test: /\.ts(x)?$/,
              loader: "ts-loader",
              exclude: /node_modules/,
            },
            {
              test: /\.scss$/,
              use: [
                isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                "css-loader",
                "sass-loader",
              ],
            },
            {
              test: /\.svg$/,
              use: "file-loader",
            },
            {
              test: /\.png$/,
              use: [
                {
                  loader: "url-loader",
                  options: {
                    mimetype: "image/png",
                  },
                },
              ],
            },
          ],
        },
        resolve: {
          extensions: [".tsx", ".ts", ".js"],
        },
      },
      plugins: plugins,
    };
  });
};

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (_env, argv) => ({
  devtool: argv.mode === "development" ? "eval-source-map" : false,
  entry: "./src/index.jsx",
  output: {
    filename: "bundle.[contenthash].js",
    clean: true,
  },
  devServer: {
    static: "./dist",
    port: 3000,
    open: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.module\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                namedExport: false,
                exportLocalsConvention: "as-is",
              },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        exclude: /\.module\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
});

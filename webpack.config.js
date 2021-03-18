const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const sass =  require('sass')
const DIST_PATH = path.join(__dirname, 'dist')

const htmlPlugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/templates/home.pug',
  }),
]

module.exports = (_, { mode }) => {
  const isProd = mode === 'production'
  return {
    entry: './src/home.ts',
    output: {
      publicPath: '/',
      path: DIST_PATH,
      filename: 'assets/home-[contenthash].js'
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'pug-loader',
              options: {
                pretty: true,
              },
            },
          ],
        },
        {
          test: /\.ts$/,
          use: [
            'babel-loader',
            'ts-loader',
          ],
        },
        {
          test: /\.(css|sass|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                implementation: sass,
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|webp)(\?.*)?$/i,
          use: [
            {
              loader: 'responsive-loader',
              options: {
                name: 'assets/[name]-[width]-[contenthash].[ext]',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },
    plugins: [
      ...htmlPlugins,
      new MiniCssExtractPlugin({
        filename: 'assets/[name]-[contenthash].css',
      }),
      isProd && new OptimizeCSSAssetsPlugin(),
      new FaviconsWebpackPlugin({
        logo: 'src/assets/favicon.svg',
        cache: true,
      }),
      new CleanWebpackPlugin(),
    ].filter(o => o),
    devServer: {
      contentBase: DIST_PATH,
      port: 9000,
      hot: true,
      inline: true,
    },
    target: ['web', 'es5'],
  }
}

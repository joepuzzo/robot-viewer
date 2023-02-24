const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000');

module.exports = {
  entry: [path.resolve(__dirname, '../index.js')],
  output: {
    filename: 'transformed.[hash].js',
    path: path.join(__dirname, '../build'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          fullySpecified: false,
        },
        use: {
          loader: 'babel-loader',
        },
      },
      // See here https://github.com/pmndrs/react-spring/issues/2097 for why I needed to add this bullshit
      {
        test: /react-spring/i,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.css$/i,
        // For some reason, css files are being tree-shaken. This currently tells webpack that ALL css
        // files are required, not just the ones that aren't used by dead components.
        sideEffects: true,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.png($|\?)|\.jpg($|\?)|\.gif($|\?)/,
        loader: 'url-loader',
        options: {
          limit: imageInlineSizeLimit,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.join(__dirname, '../public/index.html'),
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    alias: {
      Components: path.resolve(__dirname, '../components/'),
      Utils: path.resolve(__dirname, '../utils/utils'),
      Hooks: path.resolve(__dirname, '../hooks/hooks'),
    },
  },
};

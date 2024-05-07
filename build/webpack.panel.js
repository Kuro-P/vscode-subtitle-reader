const path = require('path')
const chalk = require('chalk')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { SRC_DIR, DIST_DIR, mode, isDev, DEV_PORT } = require('./const')
const { compileCallbackPlugin } = require('./plugin')

console.log(chalk.bgCyan(`start compile panel (dev mode: ${ isDev })`))

const panelConfig = {
  name: 'webCompile',
  target: 'web',
  entry: {
    main: path.join(SRC_DIR, 'assets/main.ts')
  },
  watchOptions: {
    // !!! The value of poll better not set True, it will cause slowly detect file changed (5007ms once again)
    poll: 500,
    ignored: /node_modules/
  },
  devServer : {
    open: false,
    static: {
      directory: DIST_DIR
    },
    hot: true,
    // do not use port 6000, it's an unsafe port in Chrome
    port: DEV_PORT,
    allowedHosts: 'all',
    client: {
      logging: 'info'
    },
    compress: true,
    // https://stackoverflow.com/questions/31602697/webpack-dev-server-cors-issue
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  mode,
  stats: 'normal',
  devtool: isDev ? 'eval-cheap-source-map' : false,
  output: {
    environment: {
      // The environment supports arrow functions ('() => { ... }').
      arrowFunction: false,
      // The environment supports BigInt as literal (123n).
      bigIntLiteral: false,
      // The environment supports const and let for variable declarations.
      const: false,
      // The environment supports destructuring ('{ a, b } = obj').
      destructuring: false,
      // The environment supports an async import() function to import EcmaScript modules.
      dynamicImport: false,
      // The environment supports 'for of' iteration ('for (const x of array) { ... }').
      forOf: false,
      // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
      module: false,
    },
    filename: '[name].js',
    path: DIST_DIR,
  },
  resolve: {
    extensions: [
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.json',
      '.scss',
      '.css',
      '.svg',
    ],
    modules: [ 'node_modules' ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)?$/,
        type: 'javascript/auto',
        loader: 'swc-loader',
        options: {
          'jsc': {
            'parser': {
              'syntax': 'typescript',
              'decorators': true,
              'tsx': true
            },
            'transform': {
              'react': {
                'runtime': 'automatic'
              }
            }
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'autoprefixer',
                  'postcss-preset-env'
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          esModule: false,
          limit: isDev ? 512000 : 200000,
          name: '[name].[ext]',
          outputPath: (fname, fpath, context) => {
            const relative = path.relative(context, fpath)
            return `/${relative}`
          },
          publicPath: '/imgs/',
        },
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new compileCallbackPlugin()
  ],
}

module.exports = panelConfig

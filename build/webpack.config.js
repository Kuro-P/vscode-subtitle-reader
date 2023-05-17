const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { SRC_DIR, DIST_DIR } = require('./const');
const { compileCallbackPlugin } = require('./plugin');

const mode = process.env.NODE_ENV || 'production';
const isDev = mode === 'development';


const extensionConfig = {
  name: 'extensionCompile',
  target: 'node',
  watchOptions: {
    poll: true,
    ignored: /node_modules/
  },
  node: {
    __dirname: true, // leave the __dirname-behaviour intact
    __filename: true
  },
  entry: {
    extension: path.join(SRC_DIR, 'extension.ts')
  },
  mode,
  stats: 'normal',
  externals: {
    'vscode': 'commonjs vscode', // ignored because it doesn't exist
  },
  output: {
    filename: '[name].js',
    path: DIST_DIR,
    libraryTarget: "commonjs",
  },
  devtool: isDev ? 'eval-cheap-source-map' : false,
  resolve: {
    mainFields: [ 'module', 'main' ],
    extensions: [
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
    ],
    alias: {
      'handlebars': 'handlebars/dist/handlebars.js'
    }
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
    ]
  }
};


const webConfig = {
  name: 'webCompile',
  target: 'web',
  entry: {
    main: path.join(SRC_DIR, 'assets/main.ts')
  },
  watchOptions: {
    poll: true,
    ignored: /node_modules/
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
    modules: [ 'node_modules', SRC_DIR ],
    alias: {
      '@src': SRC_DIR
    },
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
            const relative = path.relative(context, fpath);
            return `/${relative}`;
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
};


module.exports = [ extensionConfig, webConfig ];

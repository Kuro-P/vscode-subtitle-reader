const path = require('path')
const chalk = require('chalk')
const { SRC_DIR, DIST_DIR, mode, isDev } = require('./const')

console.log(chalk.bgMagenta(`start compile extension (dev mode: ${ isDev })`))

const extensionConfig = {
  name: 'extensionCompile',
  target: 'node',
  entry: {
    extension: path.join(SRC_DIR, 'extension.ts')
  },
  // !!! Hot reload not support for now
  // watchOptions: {
  //   poll: 500,
  //   ignored: /node_modules/
  // },
  node: {
    __dirname: true, // leave the __dirname-behaviour intact
    __filename: true
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
}

module.exports = extensionConfig

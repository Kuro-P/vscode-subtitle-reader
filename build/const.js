const path = require('path')
const SRC_DIR = path.resolve(__dirname, '../src')
const DIST_DIR = path.resolve(__dirname, '../dist')
const mode = process.env.NODE_ENV || 'production'
const isDev = mode === 'development'
const DEV_PORT = 8888

module.exports = {
  SRC_DIR,
  DIST_DIR,
  mode,
  isDev,
  DEV_PORT
}

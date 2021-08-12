/**
 * 定义项目的配置
 */
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const config = {
  resolve: {
    alias: {
    }
  }
}

module.exports = config

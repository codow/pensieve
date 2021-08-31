'use strict'
const path = require('path')
const utils = require('./utils')
const portfinder = require('portfinder')

// 导入配置
const config = require('../config')
const baseWebpackConfig = require('./webpack.base.conf')

const Webpack = require('webpack')
const WebpackMerge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = WebpackMerge.merge(baseWebpackConfig, {
  // v4 新增
  mode: 'development',

  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    // v5 调整
    client: {
      // 'log' | 'info' | 'warn' | 'error' | 'none' | 'verbose'
      logging: 'warn',
      overlay: config.dev.errorOverlay
        ? { warnings: false, errors: true }
        : false
    },
    static: {
      publicPath: config.dev.assetsPublicPath,
    },
    proxy: config.dev.proxyTable,
  },
  // v5 开启编译文件的监听
  watchOptions: {
    poll: config.dev.poll,
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ],
  optimization: {
    chunkIds: 'named',
    emitOnErrors: false
  }
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      // devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
      //   compilationSuccessInfo: {
      //     messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
      //   },
      //   onErrors: config.dev.notifyOnErrors
      //     ? utils.createNotifierCallback()
      //     : undefined
      // }))

      resolve(devWebpackConfig)
    }
  })
})

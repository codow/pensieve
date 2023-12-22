const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 9999
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/assets/css/variable.scss";`,

        implementation: require('sass') // This line must in sass option
      }
    }
  }
})

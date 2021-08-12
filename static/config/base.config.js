/* eslint-disable no-template-curly-in-string */
/**
 * 定义全局执行的函数
 */
(function (scope) {
  if (!scope.$$elastic) scope.$$elastic = {}
  if (!scope.$$elastic.config) scope.$$elastic.config = {}
  var config = scope.$$elastic.config
  // 接口的默认前缀
  var baseURL = 'http://localhost:64080'

  config.baseURL = baseURL
  // 路由接口
  config.router = {
    treeURL: '/security/getRouter'
  }
  // 设置默认登陆页
  config.loginPageURL = '/login'
  // 是否忽略登录后重定向之前的页面，为true则永远跳转系统首页
  config.ignoreLoginRedirect = true
  // 安全
  config.security = {
    getUserInfo: '/security/getUserInfo'
  }
  // 定制文件上传选项
  config.file = {
    uploadURL: baseURL + '/accessory/upload',
    downloadURL: baseURL + '/accessory/download'
  }
  // 定制数据源选项
  config.dataSource = {
    codeURL: '/code/getByCodeNo/${code}' // 数据源代码表接口
  }
}(window))

// ========================================================
// 封装动态路由，支持自动组装路由，路由合并，自动补齐组件
// @author wangyb
// @createTime 2023-07-10 15:32:20
// ========================================================

import Router from 'vue-router'

// 默认的父路由页面
const DefaultParentComponent = {
  functional,
  render (h) {
    return h('router-view')
  }
}

// 路由缓存
const RouteCache = {

}

// 组件缓存
const RouteComponents = {

}

/**
 * 
 * @param {*} options { routes: [], mode: 'tab' | 'default',  }
 */
const createRouter = function ({ routes: [] } = {}) {

}

/**
 * 安装路由
 * @param {*} vue 
 */
const install = function (vue) {
  if (install.installed) {
    return
  }
  vue.use(Router)
}

export {
  install,
  createRouter
}
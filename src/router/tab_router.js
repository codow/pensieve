/* eslint-disable no-eval */
import Vue from 'vue'
import Router from 'vue-router'
// import { normalizeLocation } from 'vue-router/src/util/location'

Vue.use(Router)

// 加入路由的动态module创建

export function createRouter (app, options) {
  const store = app.$store
  const findRouteTab = store.getters['Route/findRouteTab']

  const updateRouteTab = function (tab, route, location) {
    if (!route) return
    location = location || {}
    tab.id = location.id || route.fullPath
    tab.title = location.title || (route.meta && route.meta.title) || route.name || '访问失败'
    if (location.componentId && location.keepAlive) {
      // 创建缓存
      store.commit('Route/addCacheView', location.componentId)
    }
    tab.componentId = location.componentId
    tab.path = route.path
    tab.query = route.query
    tab.params = route.params
  }

  const addRouteTab = function (route, location) {
    if (!route) {
      return
    }
    location = location || {}
    let tabId = location.id || route.fullPath
    // 获取title
    let title = location.title || (route.meta && route.meta.title) || route.name || '访问失败'
    if (location.componentId && location.keepAlive) {
      // 创建缓存
      store.commit('Route/addCacheView', location.componentId)
    }
    // 创建tab
    store.commit('Route/addRouteTab', {
      id: tabId,
      title: title,
      componentId: location.componentId,
      target: 'tab',
      path: route.path,
      query: route.query,
      params: route.params
    })
  }

  const handleRouterJump = function (location, route) {
    // 获取跳转方式
    let target = location.target || route.meta.target || 'tab'
    if (target === 'tab-child') {
      // 查找窗口
      let matched = [].concat(route.matched)
      matched.reverse()
      let tabRoute = matched.find(item => item.meta.target === 'tab')
      if (tabRoute) {
        // 查询当前tab是否已经有
        let tab = findRouteTab(tabRoute.path)
        let updateParams = {
          id: tabRoute.path,
          title: location.title || (tabRoute.meta && tabRoute.meta.title) || tabRoute.name || '访问失败'
        }
        if (typeof tabRoute.components.default !== 'function') {
          updateParams.componentId = tabRoute.components.default.name
          updateParams.keepAlive = tabRoute.meta.keepAlive
        }
        if (tab) {
          updateRouteTab(tab, route, updateParams)
          store.commit('Route/setActiveRouteTab', tab.id)
        } else {
          addRouteTab(route, updateParams)
        }
      }
    }
    // tab打开方式
    if (target === 'tab') {
      let matchedRoute = route.matched[route.matched.length - 1] || {}
      let updateParams = {
        id: location.id,
        title: location.title
      }
      if (matchedRoute.components && typeof matchedRoute.components.default !== 'function') {
        updateParams.componentId = matchedRoute.components.default.name
        updateParams.keepAlive = matchedRoute.meta.keepAlive
      }
      addRouteTab(route, updateParams)
    }
  }

  const router = new Router(Object.assign({
    mode: 'history',
    base: __dirname,
    linkActiveClass: 'is-active',
    routes: []
  }, options))

  router._push = router.push

  router.push = function (location, onComplete, onAbort) {
    // 解析路由
    let to = router.resolve(location)
    let route = to.route
    let target = location.target || route.meta.target || 'tab'
    // 外部打开方式
    if (target === '_blank') {
      // 获取完整路径，然后打开外部页面
      window.open(to.href, '_blank')
      return
    }
    // 处理路由
    handleRouterJump(location, route)
    // 避免重复跳转
    let currentRoute = router.currentRoute
    if (currentRoute.fullPath === route.fullPath) {
      return
    }
    return this._push(location, onComplete, onAbort)
  }

  router._replace = router.replace

  router.replace = function (location, onComplete, onAbort) {
    // 解析路由
    let to = router.resolve(location)
    let route = to.route
    let target = location.target || route.meta.target || 'tab'
    // 外部打开方式
    if (target === '_blank') {
      // 获取完整路径，然后打开外部页面
      window.open(to.href, '_blank')
      return
    }
    // 处理路由
    handleRouterJump(location, route)
    // 避免重复跳转
    let currentRoute = router.currentRoute
    if (currentRoute.fullPath === route.fullPath) {
      return
    }
    // 如果未匹配到
    // if (store.state.Route.loaded && !route.matched.length) {
    //   location = store.state.Route.unknownPath
    // }
    return this._replace(location, onComplete, onAbort)
  }

  router._match = router.match

  router.match = function (raw, current, redirectedFrom) {
    raw = raw || {}
    let path = raw.path || raw
    let name = raw.title || raw
    // console.log('arguments', raw, current, redirectedFrom)
    let matchResult = router._match(raw, current, redirectedFrom)
    // console.log('matchResult', matchResult)
    // matchResult.matched.splice(0, 1)
    // 根据实际需要来替换matched
    if (matchResult.matched.length) return matchResult
    matchResult = router.match(store.state.Route.unknownPath, current, redirectedFrom)
    if (!matchResult.matched.length) return matchResult
    matchResult.matched[matchResult.matched.length - 1].path = path
    matchResult.matched[matchResult.matched.length - 1].name = name
    matchResult.fullPath = path
    matchResult.path = path
    // 获取当前路由
    // 如果没有找到页面，则替换为404页面
    // 验证路由权限，如果没有权限，则替换为无权限的错误页面
    return matchResult
  }

  // router.beforeResolve((to, from, next) => {
  //   /* 必须调用 `next` */
  //   if (store.state.Route.loaded && !to.matched.length) {
  //     // 未匹配到
  //     next(store.state.Route.unknownPath)
  //   } else {
  //     next()
  //   }
  // })

  router.afterEach((to, from) => {
    const route = to.matched[to.matched.length - 1]
    if (!route) {
      return
    }
    const tab = findRouteTab(to.fullPath)
    if (!tab || tab.componentId) {
      return
    }
    const componentId = route.components.default.name
    // 更新tab
    tab.componentId = componentId
    // 判断是否需要保存缓存
    if (to.meta.keepAlive) {
      store.commit('Route/addCacheView', componentId)
    }
  })

  return router
}

// 当前项目自己使用，不用动态路由
const defaultRouter = new Router({
  // mode: 'hash',
  mode: 'history',
  base: __dirname,
  linkActiveClass: 'is-active',
  routes: []
})

export default defaultRouter

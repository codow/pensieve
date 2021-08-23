/**
 * 提供路由的功能
 * @author wangyb
 * @createTime 2021-08-10 17:56:17
 */

// 获取路由对象
import Router from '../router'

const storage = window.sessionStorage

const updateRouteTab = function (tab, route, location) {
  if (!route) return
  location = location || {}
  tab.id = location.id || route.fullPath
  tab.title = location.title || (route.meta && route.meta.title) || route.name || '访问失败'
  if (location.componentId && location.keepAlive) {
    // 创建缓存
    routerStore.mutations.addCacheView(routerStore.state, location.componentId)
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
    routerStore.mutations.addCacheView(routerStore.state, location.componentId)
  }
  // 创建tab
  routerStore.mutations.addRouteTab(routerStore.state, {
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
      let tab = routerStore.state.routeTabs.find(item => item.id === tabRoute.path)
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
        routerStore.state.activeRouteTab = tab.id
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

Router._push = Router.push

Router.push = function (location, onComplete, onAbort) {
  // 解析路由
  let to = Router.resolve(location)
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
  let currentRoute = Router.currentRoute
  if (currentRoute.fullPath === route.fullPath) {
    return
  }
  return this._push(location, onComplete, onAbort)
}

Router._replace = Router.replace

Router.replace = function (location, onComplete, onAbort) {
  // 解析路由
  let to = Router.resolve(location)
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
  let currentRoute = Router.currentRoute
  if (currentRoute.fullPath === route.fullPath) {
    return
  }
  // 如果未匹配到
  if (routerStore.state.loaded && !route.matched.length) {
    location = routerStore.state.unknownPath
  }
  return this._replace(location, onComplete, onAbort)
}

Router.beforeResolve((to, from, next) => {
  /* 必须调用 `next` */
  if (routerStore.state.loaded && !to.matched.length) {
    // 未匹配到
    next(routerStore.state.unknownPath)
  } else {
    next()
  }
})

Router.afterEach((to, from) => {
  const route = to.matched[to.matched.length - 1]
  if (!route) {
    return
  }
  const tab = routerStore.state.routeTabs.find(item => item.id === to.fullPath)
  if (!tab || tab.componentId) {
    return
  }
  const componentId = route.components.default.name
  // 更新tab
  tab.componentId = componentId
  // 判断是否需要保存缓存
  if (to.meta.keepAlive) {
    routerStore.mutations.addCacheView(routerStore.state, componentId)
  }
})

const routerStore = {
  namespaced: true,

  state: {
    loaded: true,
    routes: [],
    cacheViewsName: '',
    cacheViews: [],
    indexPath: '/',
    unknownPath: '/404',
    activeRouteTab: null,
    routeTabs: [{ id: '/index', path: '/index', componentId: 'FrHome', title: '首页', fixed: true }]
  },

  mutations: {
    setRoutes (state, routes) {
      state.loaded = true
      state.routes = routes
    },
    addRouteTab (state, tab) {
      if (!tab) {
        return
      }
      const routeTabs = state.routeTabs
      // 推入菜单
      let oldTab = routeTabs.find(item => item.id === tab.id)
      if (oldTab) {
        state.activeRouteTab = oldTab.id
      } else {
        routeTabs.push(tab)
        state.activeRouteTab = tab.id
        storage.setItem('routeTabs', JSON.stringify(routeTabs))
      }
      storage.setItem('activeRouteTab', state.activeRouteTab)
    },
    openRouteTab (state, tabId) {
      const routeTabs = state.routeTabs
      const tab = routeTabs.find(item => item.id === tabId)
      if (!tab) {
        return
      }
      state.activeRouteTab = tabId
      // 跳转
      Router._push(tab)
    },
    closeRouteTab (state, tabId) {
      const routeTabs = state.routeTabs
      let index = routeTabs.findIndex(item => item.id === tabId)
      if (state.activeRouteTab === tabId) {
        let nextRouteTab
        if (index < routeTabs.length - 1) {
          nextRouteTab = routeTabs[index + 1]
        } else if (index > 0) {
          nextRouteTab = routeTabs[index - 1]
        }
        if (nextRouteTab) {
          // 调整激活的tab
          routerStore.mutations.addRouteTab(state, nextRouteTab)
          // 跳转
          Router._push(nextRouteTab)
        }
      }
      if (index !== -1) {
        let tabs = routeTabs.splice(index, 1)
        routerStore.mutations.removeCacheViews(state, tabs.map(item => item.componentId))
        // 缓存
        storage.setItem('routeTabs', JSON.stringify(routeTabs))
      }
    },
    closeRouteTabs (state, tabIds) {
      if (!tabIds || !tabIds.length) {
        return
      }
      // 删除多余的ID
      const map = {}
      tabIds.forEach(tabId => {
        map[tabId] = true
      })
      const removedRouteTabComponentIds = []
      state.routeTabs = state.routeTabs.filter(item => {
        if (map[item.id]) {
          removedRouteTabComponentIds.push(item.componentId)
          return false
        }
        return true
      })
      // 清理缓存
      routerStore.mutations.removeCacheViews(state, removedRouteTabComponentIds)
      const nextRouteTab = state.routeTabs[0]
      if (map[state.activeRouteTab] && nextRouteTab) {
        state.activeRouteTab = nextRouteTab.id
        // 获取参数
        Router._push(nextRouteTab)
      }
      // 缓存
      storage.setItem('routeTabs', JSON.stringify(state.routeTabs))
    },
    setActiveRouteTab (state, tabId) {
      state.activeRouteTab = tabId
    },
    addCacheView (state, viewName) {
      const { cacheViews } = state
      if (cacheViews.includes(viewName)) {
        return
      }
      cacheViews.push(viewName)
      state.cacheViewsName = cacheViews.join(',')
    },
    removeCacheViews (state, viewNames) {
      if (!viewNames) {
        return
      }
      const map = {}
      viewNames.forEach(item => map[item] = 1)
      state.cacheViews = state.cacheViews.filter(item => !map[item])
      state.cacheViewsName = state.cacheViews.join(',')
    }
  },

  actions: {
    async initRoute ({ state, commit, rootState }) {
      // 异步加载路由信息
      let response = await rootState.app.$http.get(rootState.app.$$elastic.config.router.treeURL, {
        params: {
          id: '-1'
        }
      })
      if (response.status === 'success' && response.data) {
        // 初始化守护路由
        let data = response.data
        let routes = data.list || data
        // 解析路由 生成动态路由
        parseRoutes(routes)
        // 设置路由'
        routerStore.mutations.setRoutes(state, routes)
        // 设置路由
        Router.addRoutes(routes)
        // 关闭加载动画
        window.document.querySelector("#systemLoading").style.display = 'none'
      }
    }
  },

  getters: {
    routeTree: state => {
      // 对路由树进行计算
      return state.routes
    }
  }
}

/**
 * 从sessionStorage中初始化
 */
const init = function () {
  let activeRouteTab = storage.getItem('activeRouteTab')
  if (activeRouteTab) {
    routerStore.state.activeRouteTab = activeRouteTab
  }
  let routeTabs = (storage.getItem('routeTabs') && JSON.parse(storage.getItem('routeTabs')))
  if (routeTabs && routeTabs.length) {
    routerStore.state.routeTabs = routeTabs
    // 加载缓存
    let cacheViews = routeTabs.map(item => item.componentId)
    routerStore.state.cacheViews = cacheViews.filter(item => !!item)
    routerStore.state.cacheViewsName = routerStore.state.cacheViews.join(',')
  }
}

// 初始化
init()

export default routerStore
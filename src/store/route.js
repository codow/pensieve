/**
 * 提供路由的功能
 * @author wangyb
 * @createTime 2021-08-10 17:56:17
 */
import app from '../main'

// 获取路由对象
import { createRouter } from '../router/tab_router'

const storage = window.sessionStorage

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
    routeTabs: [
      {
        id: '/index',
        path: '/index',
        componentId: 'FrHome',
        title: '首页',
        fixed: true
      }
    ]
  },

  mutations: {
    setRoutes(state, routes) {
      state.loaded = true
      state.routes = routes
      // 创建一个router对象
      const router = createRouter(app, { routes })
      // 设置信息到app上
      app.registRouter(router)
    },
    addRouteTab(state, tab) {
      if (!tab) {
        return
      }
      const routeTabs = state.routeTabs
      // 推入菜单
      let oldTab = routeTabs.find((item) => item.id === tab.id)
      if (oldTab) {
        state.activeRouteTab = oldTab.id
      } else {
        routeTabs.push(tab)
        state.activeRouteTab = tab.id
        storage.setItem('routeTabs', JSON.stringify(routeTabs))
      }
      storage.setItem('activeRouteTab', state.activeRouteTab)
    },
    openRouteTab(state, tabId) {
      const routeTabs = state.routeTabs
      const tab = routeTabs.find((item) => item.id === tabId)
      if (!tab) {
        return
      }
      state.activeRouteTab = tabId
      // 跳转
      app.$router._push(tab)
    },
    closeRouteTab(state, tabId) {
      const routeTabs = state.routeTabs
      let index = routeTabs.findIndex((item) => item.id === tabId)
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
          app.$router._push(nextRouteTab)
        }
      }
      if (index !== -1) {
        let tabs = routeTabs.splice(index, 1)
        routerStore.mutations.removeCacheViews(
          state,
          tabs.map((item) => item.componentId)
        )
        // 缓存
        storage.setItem('routeTabs', JSON.stringify(routeTabs))
      }
    },
    closeRouteTabs(state, tabIds) {
      if (!tabIds || !tabIds.length) {
        return
      }
      // 删除多余的ID
      const map = {}
      tabIds.forEach((tabId) => {
        map[tabId] = true
      })
      const removedRouteTabComponentIds = []
      state.routeTabs = state.routeTabs.filter((item) => {
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
        app.$router._push(nextRouteTab)
      }
      // 缓存
      storage.setItem('routeTabs', JSON.stringify(state.routeTabs))
    },
    setActiveRouteTab(state, tabId) {
      state.activeRouteTab = tabId
    },
    addCacheView(state, viewName) {
      const { cacheViews } = state
      if (cacheViews.includes(viewName)) {
        return
      }
      cacheViews.push(viewName)
      state.cacheViewsName = cacheViews.join(',')
    },
    removeCacheViews(state, viewNames) {
      if (!viewNames) {
        return
      }
      const map = {}
      viewNames.forEach((item) => (map[item] = 1))
      state.cacheViews = state.cacheViews.filter((item) => !map[item])
      state.cacheViewsName = state.cacheViews.join(',')
    }
  },

  actions: {
    async initRoute({ state, commit, rootState }) {
      // 异步加载路由信息
      let response = await rootState.app.$http.get(
        rootState.app.$$elastic.config.router.treeURL,
        {
          params: {
            id: '-1'
          }
        }
      )
      if (response.status === 'success' && response.data) {
        // 初始化守护路由
        let data = response.data
        let routes = data.list || data
        // 解析路由 生成动态路由
        // parseRoutes(routes)
        // 设置路由
        commit('setRoutes', routes)
        // 关闭加载动画
        window.document.querySelector('#systemLoading').style.display = 'none'
      }
    }
  },

  getters: {
    routeTree: (state) => {
      // 对路由树进行计算
      return state.routes
    },
    findRouteTab: (state) => (id) => {
      return state.routeTabs.find((item) => item.id === id)
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
  let routeTabs =
    storage.getItem('routeTabs') && JSON.parse(storage.getItem('routeTabs'))
  if (routeTabs && routeTabs.length) {
    routerStore.state.routeTabs = routeTabs
    // 加载缓存
    let cacheViews = routeTabs.map((item) => item.componentId)
    routerStore.state.cacheViews = cacheViews.filter((item) => !!item)
    routerStore.state.cacheViewsName = routerStore.state.cacheViews.join(',')
  }
}

// 初始化
init()

export default routerStore

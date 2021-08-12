/**
 * 提供路由的功能
 * @author wangyb
 * @createTime 2021-08-10 17:56:17
 */

// 获取路由对象
import Router from '../router'

const storage = window.sessionStorage

Router._push = function (location, onComplete, onAbort) {
  if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => {
      this.history.push(location, resolve, reject)
    })
  } else {
    this.history.push(location, onComplete, onAbort)
  }
}

Router.push = function (location, onComplete, onAbort) {
  // 获取跳转方式
  let target = location.target || 'tab'
  // 解析路由
  let to = Router.resolve(location)
  let route = to.route
  // 外部打开方式
  if (target === '_blank') {
    // 获取完整路径，然后打开外部页面
    window.open(to.href, '_blank')
    return
  }
  // tab打开方式
  if (target === 'tab') {
    let tabId = route.fullPath
    // 避免重复跳转
    if (routerStore.state.activeRouteTab === tabId) {
      return
    }
    // 获取title
    let title = location.title || (route.meta && route.meta.title) || route.name || '访问失败'
    // 创建tab
    routerStore.mutations.addRouteTab(routerStore.state, {
      id: tabId,
      title: title,
      target: 'tab',
      path: route.path,
      query: route.query,
      params: route.params
    })
  }
  return this._push(location, onComplete, onAbort)
}

Router._replace = function (location, onComplete, onAbort) {
  console.log('自定义刷新方法')
  if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => {
      this.history.replace(location, resolve, reject)
    })
  } else {
    this.history.replace(location, onComplete, onAbort)
  }
}

Router.replace = function (location, onComplete, onAbort) {
  console.log('自定义刷新方法')
  if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => {
      this.history.replace(location, resolve, reject)
    })
  } else {
    this.history.replace(location, onComplete, onAbort)
  }
}

Router.beforeResolve((to, from, next) => {
  /* 必须调用 `next` */
  if (!to.matched.length) {
    // 未匹配到
    next(routerStore.state.unknownPath)
  } else {
    next()
  }
})

const routerStore = {
  state: {
    indexPath: '/index',
    unknownPath: '/404',
    activeRouteTab: storage.getItem('activeRouteTab') || null,
    routeTabs: (storage.getItem('routeTabs') && JSON.parse(storage.getItem('routeTabs'))) || [{
      id: '/index',
      title: '首页',
      path: '/index',
      fixed: true
    }]
  },

  mutations: {
    addRouteTab (state, tab) {
      if (!tab) {
        // 访问首页
        Router.push(state.indexPath)
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
        // 调整激活的tab
        this.commit('addRouteTab', nextRouteTab)
        // 跳转
        Router._push(nextRouteTab)
      }
      if (index !== -1) {
        routeTabs.splice(index, 1)
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
      const routeTabs = state.routeTabs
      for (let i = 0; i < routeTabs.length;) {
        if (map[routeTabs[i].id]) {
          routeTabs.splice(i, 1)
        } else {
          i++
        }
      }
      if (map[state.activeRouteTab]) {
        // 获取参数
        Router._push(routeTabs[0])
      }
      // 缓存
      storage.setItem('routeTabs', JSON.stringify(routeTabs))
    },
    setActiveRouteTab (state, tabId) {
      state.activeRouteTab = tabId
    }
  }
}

export default routerStore

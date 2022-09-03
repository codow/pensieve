// 第三方插件
import store from './store'
import router from './router/tab_router'
import routes from './assets/data/routes'

import { mapGetters, mapMutations } from 'vuex'

// 入口组件
import App from './App.vue'

// 插件
import './plugins/element'
import './plugins/http'

// 引入样式
import './assets/css/index.less'
import Vue from 'vue'
// import './assets/css/dark.less';

import utils from './utils'
import { isArray, isObject } from './utils/packages/validator'

import draggable from './components/draggable'

Vue.component('draggable', draggable)

Vue.prototype.$utils = utils

/**
   * 给对象设置指定的数据，支持嵌套和数组
   * @param {Object|Array} obj 需要检索的对象或数组
   * @param {String} path 属性的路径
   * @param {*} value 数据
   */
Vue.prototype.$setByPath = function (obj, path, value) {
  if (!path || !(isArray(obj) || isObject(obj))) return value
  // 替换数组标志
  const p = path.replace(/\[([0-9]+)\]/g, (str, $1) => {
    return '.$_$' + $1 + '$_$'
  })
  // 分割路径, 支持以,、;、.分割
  const pArray = p.split(/[,;.]/)
  let curr = obj
  const lastIndex = pArray.length - 1
  // 遍历路径
  const indexRegex = /^\$_\$[0-9]+\$_\$$/
  pArray.forEach((item, index) => {
    let temp = item
    const arrayFlag = indexRegex.test(temp)
    if (arrayFlag) {
      temp = temp.replace(/\$_\$/g, '')
    }

    if (index === lastIndex) {
      this.$set(curr, temp, value)
    } else if (!isArray(curr[temp]) && !isObject(curr[temp])) {
      this.$set(curr, temp, indexRegex.test(pArray[index + 1]) ? [] : {})
    }
    curr = curr[temp]
  })

  return value
}
/**
 * 从对象中获取指定的数据，支持嵌套和数组
 * @param {Object|Array} obj 需要检索的对象或数组
 * @param {String} path 属性的路径
 */
Vue.prototype.$getByPath = function (obj, path) {
  if (!path || !(isArray(obj) || isObject(obj))) return undefined
  // 替换数组标志
  const p = path.replace(/\[([0-9]+)\]/g, (str, $1) => {
    return '.$_$' + $1 + '$_$'
  })
  // 分割路径, 支持以,、;、.分割
  const pArray = p.split(/[,;.]/)
  let value
  let curr = obj
  const lastIndex = pArray.length - 1
  // 遍历路径
  const indexRegex = /^\$_\$[0-9]+\$_\$$/
  for (let index = 0; index <= lastIndex; index++) {
    let temp = pArray[index]
    const arrayFlag = indexRegex.test(temp)
    if (arrayFlag) {
      temp = temp.replace(/\$_\$/g, '')
    }

    if (index === lastIndex) {
      value = curr[temp]
    }
    curr = curr[temp]
    if (!curr) break
  }

  return value
}

/**
   * 从对象中获取指定的数据，支持嵌套和数组
   * @param {Object|Array} obj 需要检索的对象或数组
   * @param {String} path 属性的路径
   */
Vue.prototype.$deleteByPath = function (obj, path) {
  if (!path || !(utils.validator.isArray(obj) || utils.validator.isObject(obj))) return false
  // 替换数组标志
  const p = path.replace(/\[([0-9]+)\]/g, (str, $1) => {
    return '.$_$' + $1 + '$_$'
  })
  // 分割路径, 支持以,、;、.分割
  const pArray = p.split(/[,;.]/)
  let curr = obj
  const lastIndex = pArray.length - 1
  // 遍历路径
  const indexRegex = /^\$_\$[0-9]+\$_\$$/
  for (let index = 0; index <= lastIndex; index++) {
    let temp = pArray[index]
    const arrayFlag = indexRegex.test(temp)
    if (arrayFlag) {
      temp = temp.replace(/\$_\$/g, '')
    }

    if (index === lastIndex) {
      if (arrayFlag) {
        curr.splice(temp, 1)
      } else {
        this.$delete(curr, temp)
      }
      return true
    }
    curr = curr[temp]
    if (!curr) break
  }

  return false
}

// 给应用模块加个全局配置
const appMixin = {
  computed: {
    ...mapGetters({
      getSysApp: 'Apps/getApp',
      getSysAppOptions: 'Apps/getAppOptions',
      getSysAppOption: 'Apps/getAppOption'
    })
  },
  methods: {
    ...mapMutations({
      setSysAppOptions: 'Apps/setAppOptions'
    })
  }
}
Vue.mixin(appMixin)

var app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 创建一个替换router实例的逻辑
app.registRouter = function (router) {
  if (!router) return
  this._router = router
  this._router.init(this)
  Vue.util.defineReactive(this, '_route', this._router.history.current)
}

// 保存app，以便其他地方使用
store.commit('initApp', app)

// 动态注册应用
store.commit('Apps/registApp', {
  name: 'childApp',
  app: {
    options: {
      enableGroup: false,
      enableCompany: false,
      enableAdmin: false,
      enableDeptInChargen: false,
      enableApplyAgent: false
    }
  }
})


// 异步加载routes
setTimeout(() => {
  store.commit('Route/setRoutes', routes)
}, 300)

export default app

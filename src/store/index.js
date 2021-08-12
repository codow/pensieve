import Vue from 'vue'
import Vuex from 'vuex'
// 加载store模块
import Canvas from './canvas'
import Route from './route'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Canvas,
    Route
  },

  state: {
    // 记录vue实例
    app: null
  },

  mutations: {
    initApp (state, app) {
      state.app = app
    }
  },

  getters: {
    key: state => state.User.key
  }
})

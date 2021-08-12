// 入口文件
import Vue from 'vue'
// 第三方插件
import store from './store'
import router from './router'

// 入口组件
import App from './App.vue'

// 插件
import './plugins/element'

// 引入样式
import './assets/css/index.less'

var app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 保存app，以便其他地方使用
store.commit('initApp', app)
/* eslint-disable no-eval */
import Vue from 'vue'
import Router from 'vue-router'
import routes from '../assets/data/routes'

Vue.use(Router)

// 当前项目自己使用，不用动态路由
const router = new Router({
  // mode: 'hash',
  mode: 'history',
  base: __dirname,
  linkActiveClass: 'is-active',
  routes: routes
})

const _init = router.init

router.init = function (app) {
  // console.log('router init', app)
  _init.call(this, app)
}

export default router

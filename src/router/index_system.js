/* eslint-disable no-eval */
import Router from 'vue-router'
import routes from '../assets/data/routes_system'

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
  console.log('router systems init', app)
  _init.call(this, app)
}

export default router

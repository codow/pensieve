// 第三方插件
import store from './store';
import router from './router/tab_router';
import routes from './assets/data/routes';

// 入口组件
import App from './App.vue';

// 插件
import './plugins/element';
import './plugins/http';

// 引入样式
// import './assets/css/index.less';
import './assets/css/dark.less';

var app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

// 创建一个替换router实例的逻辑
app.registRouter = function(router) {
  if (!router) return;
  this._router = router;
  this._router.init(this);
  Vue.util.defineReactive(this, '_route', this._router.history.current);
};

// 保存app，以便其他地方使用
store.commit('initApp', app);

// 异步加载routes
setTimeout(() => {
  store.commit('Route/setRoutes', routes);
}, 300);

export default app;

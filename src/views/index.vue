<template>
  <el-container class="home-conatiner fr-full">
    <el-header class="home-header padding__empty">
      <el-container class="fr-full"
                    direction="horizontal">
        <el-aside class="home-header-title"
                  :width="leftAsideWidth">
          <img class="home-header-title__logo"
               src="/static/img/logo.png" />
          <span>后端管理</span>
        </el-aside>
        <el-main class="padding__small">
          全文检索 / 常用功能 / 快捷菜单 / <span style="cursor: pointer;" @click="loadRoute">加载路由</span>
        </el-main>
        <el-aside class="padding__small"
                  :width="rightAsideWidth"
                  style="text-align: right;">
          个性化配置 / 用户个人信息
        </el-aside>
      </el-container>
    </el-header>
    <el-main class="padding__empty">
      <el-container class="fr-full">
        <el-aside :width="leftAsideWidth"
                  class="home-aside">
          <fr-menu :data="menuData"
                   :menu-click="handleMenuClick"></fr-menu>
        </el-aside>
        <el-main class="padding__empty">
          <fr-router-view-tabs></fr-router-view-tabs>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<style>
.fr-full {
  width: 100%;
  height: 100%;
}

.home-conatiner {
}

.home-header {
  background-color: #6699cc;
}

.home-header-title {
  padding: 10px;
  font-weight: 600;
  font-family: "微软雅黑";
  color: #333333;
}

.home-header-title__logo {
  width: 80px;
  height: 40px;
  vertical-align: middle;
  display: inline-block;
}

.home-aside {
  background: #99ccff;
}
</style>

<script>
import FrMenu from '../components/menu'
import FrRouterViewTabs from '../components/router-view-tabs'

import MenuData from '../assets/data/menus'

import systemRoutes from '../assets/data/routes_system'

export default {
  name: 'home',
  components: {
    FrMenu,
    FrRouterViewTabs
  },
  data () {
    return {
      leftAsideWidth: '300px',
      rightAsideWidth: '300px',
      menuData: MenuData
    }
  },
  methods: {
    handleMenuClick (menu) {
      this.$router.push({
        target: menu.target,
        title: menu.label,
        path: menu.url || menu.path,
        query: menu.query,
        params: menu.params
      })
    },

    loadRoute () {
      setTimeout(() => {
        this.$store.commit('Route/setRoutes', systemRoutes)
      }, 300)
    }
  }
}
</script>
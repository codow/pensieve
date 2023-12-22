<template>
  <el-container class="home-conatiner fr-full">
    <el-header class="home-header padding__empty">
      <el-container class="fr-full"
                    direction="horizontal">
        <el-aside class="home-header-title"
                  :width="leftAsideWidth">
          <img class="home-header-title__logo"
               src="/img/logo.png" />
          <span>后端管理</span>
        </el-aside>
        <el-main class="padding__small">
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
                   :menu-click="handleMenuClick"
                   style="overflow: auto; height: 100%;"></fr-menu>
        </el-aside>
        <el-main class="padding__empty home-main">
          <fr-router-view-tabs></fr-router-view-tabs>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import FrMenu from '../components/menu'
import FrRouterViewTabs from '../components/router-view-tabs'

import MenuData from '../assets/data/menus'

export default {
  name: 'Home',
  components: {
    FrMenu,
    FrRouterViewTabs
  },
  data() {
    return {
      leftAsideWidth: '300px',
      rightAsideWidth: '300px',
      menuData: MenuData
    }
  },
  methods: {
    handleMenuClick(menu) {
      this.$router.push({
        target: menu.target,
        title: menu.label,
        path: menu.url || menu.path,
        query: menu.query,
        params: menu.params
      })
    }
  }
}
</script>
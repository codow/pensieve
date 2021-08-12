<template>
  <el-container class="home-conatiner fr-full">
    <el-header class="home-header">
      我是头部
    </el-header>
    <el-main style="padding: 0;">
      <el-container class="fr-full">
        <el-aside width="300px"
                  class="home-aside">
          <fr-menu :data="menuData"
                   :menu-click="handleMenuClick"></fr-menu>
        </el-aside>
        <el-main style="padding: 0;">
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
  background: #409eff;
}

.home-aside {
  background: rgb(160, 207, 255);
}
</style>

<script>
import FrMenu from '../components/menu'
import FrRouterViewTabs from '../components/router-view-tabs'

import MenuData from '../assets/data/menus'

export default {
  name: 'home',
  components: {
    FrMenu,
    FrRouterViewTabs
  },
  data () {
    return {
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
    }
  }
}
</script>
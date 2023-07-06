<template>
  <el-container style="height: 100%;">
    <el-header height="40"
               style="padding: 0px;">
      <div class="fr-route-views-tabs-wrapper">
        <el-tabs :value="activeRouteTab"
                 type="border-card"
                 class="fr-route-views-tabs"
                 @tab-click="handleRouteTabClick"
                 @tab-remove="handleRouteTabRemove">
          <el-tab-pane v-for="tab in routeTabs"
                       :key="tab.id"
                       :name="tab.id"
                       :label="tab.title"
                       :closable="!tab.fixed"></el-tab-pane>
        </el-tabs>
        <div class="fr-route-views-tabs-operation">
          <fr-popover-button placement="bottom-end"
                             popover-width="200"
                             trigger="click"
                             :data="operations"
                             icon="el-icon-s-operation"
                             button-class="fr-route-view-tabs-operation-btn"
                             @command="handleCommand">
          </fr-popover-button>
        </div>
      </div>
    </el-header>
    <el-main ref="routerContainer"
             style="padding: 0px;">
      <keep-alive :include="$store.state.Route.cacheViewsName"
                  :max="20">
        <router-view v-if="viewVisible && routeTabs.length"></router-view>
      </keep-alive>
    </el-main>
  </el-container>
</template>

<script>
import FrPopoverButton from '../popover-button'

export default {
  name: 'fr-route-view-tabs',
  components: {
    FrPopoverButton
  },
  computed: {
    activeRouteTab () {
      return this.$store.state.Route.activeRouteTab
    },
    currentRouteTab () {
      return this.routeTabs.find(item => item.id === this.activeRouteTab) || {}
    },
    routeTabs () {
      return this.$store.state.Route.routeTabs
    },
    operations () {
      return [{
        label: '刷新',
        id: 'refresh',
        command: 'refresh'
      }, {
        // 分割
        divide: {
          position: 'left',
          icon: 'el-icon-delete'
        },
        label: '关闭',
        id: 'close',
        command: 'close',
        is_disabled: !!this.currentRouteTab.fixed
      }, {
        label: '关闭其他',
        id: 'close-other',
        command: 'close-other'
      }, {
        label: '关闭到右侧',
        id: 'close-right',
        command: 'close-right'
      }, {
        label: '全部关闭',
        id: 'close-all',
        command: 'close-all',
        is_disabled: !!this.currentRouteTab.fixed
      }]
    }
  },
  data () {
    return {
      viewVisible: true,
    }
  },
  created () {
    this.initRouteTab()
  },
  methods: {
    initRouteTab () {
      const route = this.$route
      // 如果是错误页面
      if (route.fullPath === this.$store.state.Route.unknownPath) {
        return
      }
      this.$router.replace(route)
    },
    handleRouteTabClick (tab) {
      let tabId = tab.name
      if (this.activeRouteTab === tabId) {
        return
      }
      this.$store.commit('Route/openRouteTab', tabId)
    },
    handleRouteTabRemove (tabId) {
      this.closeRouteTab(tabId)
    },
    handleCommand (command) {
      if (command === 'refresh') {
        this.refresh()
      } else if (command === 'close') {
        this.closeRouteTab(this.activeRouteTab)

      } else if (command === 'close-right') {
        let index = this.routeTabs.findIndex(item => item.id === this.activeRouteTab)
        let tabs = []
        this.routeTabs.forEach((item, i) => {
          if (i > index) {
            tabs.push(item.id)
          }
        })
        this.closeRouteTabs(tabs)
      } else if (command === 'close-other') {
        let tabs = []
        this.routeTabs.forEach(item => {
          if (!item.fixed && item.id !== this.activeRouteTab) {
            tabs.push(item.id)
          }
        })
        this.closeRouteTabs(tabs)
      } else if (command === 'close-all') {
        let tabs = []
        this.routeTabs.forEach(item => {
          if (!item.fixed) {
            tabs.push(item.id)
          }
        })
        this.closeRouteTabs(tabs)
      }
    },
    closeRouteTab (tabId) {
      this.$store.commit('Route/closeRouteTab', tabId)
    },
    closeRouteTabs (tabIds) {
      this.$store.commit('Route/closeRouteTabs', tabIds)
    },
    refresh () {
      this.viewVisible = false
      this.$nextTick(() => {
        this.viewVisible = true
      })
    }
  }
}
</script>

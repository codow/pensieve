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
    <el-main style="padding: 0px;">
      <router-view v-if="viewVisible && routeTabs.length"
                   :key="activeRouteTab"></router-view>
    </el-main>
  </el-container>
</template>

<style>
.fr-route-views-tabs-wrapper {
  display: table;
  width: 100%;
  table-layout: fixed;
}
.fr-route-views-tabs {
  display: table-cell;
  padding: 0;
  margin: 0;
  list-style: none;
  height: 40px;
  box-shadow: none;
  border: 0;
  width: 100%;
}

.fr-route-views-tabs .el-tabs__content {
  display: none;
}

.fr-route-views-tabs-operation {
  display: table-cell;
  width: 40px;
}

.fr-route-view-tabs-operation-btn {
  margin: 0;
  width: 100%;
  border: 0;
  float: right;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  border-radius: 0;
  padding: 12px 0;
  height: 39px;
}
</style>

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
      return this.routeTabs.find(item => item.id === this.activeRouteTab)
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
  watch: {
    $route: {
      handler (route) {
        // 如果是错误页面
        if (route.path === this.$store.state.Route.unknownPath) {
          return
        }
        // 判断当前的route是否在routeTab中
        const tab = this.routeTabs.find(item => item.id === route.fullPath)
        if (!tab) {
          // 创建一个新的tab
          this.$store.commit('addRouteTab', {
            id: route.fullPath,
            title: (route.meta && route.meta.title) || route.name,
            path: route.path,
            query: route.query,
            params: route.params
          })
        } else if (this.activeRouteTab !== route.fullPath) {
          // 设置
          this.$store.commit('setActiveRouteTab', route.fullPath)
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      viewVisible: true,
    }
  },
  methods: {
    handleRouteTabClick (tab) {
      let tabId = tab.name
      if (this.activeRouteTab === tabId) {
        return
      }
      this.$store.commit('openRouteTab', tabId)
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
      this.$store.commit('closeRouteTab', tabId)
    },
    closeRouteTabs (tabIds) {
      this.$store.commit('closeRouteTabs', tabIds)
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

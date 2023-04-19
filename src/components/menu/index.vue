<template>
  <el-menu class="sp-menu"
           :collapse="collapse"
           :default-active="defaultActive"
           @select="handleMenuSelect">
    <fr-menu-item v-for="item in menuTree"
                  :key="item.id"
                  :item="item"
                  :props="config"></fr-menu-item>
  </el-menu>
</template>

<script>
import FrMenuItem from './menu-item'
import { isNotEmpty } from '../../utils/packages/validator'

// 默认配置
const DEFAULT_PROPS = {
  value: 'id',
  label: 'label',
  children: 'children',
  iconClass: 'icon_class',
  router: 'path',
  messageNumber: 'message_number'
}

export default {
  name: 'FrMenu',
  components: {
    FrMenuItem
  },
  props: {
    collapse: Boolean,
    // 静态数据
    data: Array,
    // 数据源
    dataSource: String,
    props: Object,
    menuClick: { type: Function }
  },
  data () {
    return {
      menuTree: [],
      menuCache: {},
      defaultActive: null
    }
  },
  computed: {
    config () {
      return Object.assign({}, DEFAULT_PROPS, this.props || {})
    }
  },
  watch: {
    // 重新渲染组件
    dataSource: {
      handler () {
        this.dataBinding()
      },
      immediate: true
    },
    // 监听路由参数发生改变
    $route: {
      handler () {
        // 计算默认响应
        this.initDefaultActive()
      }
    }
  },
  methods: {
    dataBinding () {
      if (isNotEmpty(this.data)) {
        this.handleMenuLoadCallback(this.data)
      } else if (isNotEmpty(this.dataSource)) {
        this.$http.get(this.dataSource).then(response => {
          if (response.status === 'success') {
            this.handleMenuLoadCallback(response.data)
          }
        })
      }
    },
    initMenuCache (list) {
      if (!list) {
        return
      }
      list.forEach(item => {
        this.menuCache[item.id] = item
        // 递归处理
        this.initMenuCache(item.children)
      })
    },
    initDefaultActive () {
      // 如果没有菜单，直接跳过
      if (!this.menuTree || !this.menuTree.length) {
        return
      }
      // 获取当前路径
      const { matched } = this.$route
      if (!matched || !matched.length) {
        return
      }
      const matchedRoute = matched[matched.length - 1]
      // 获取当前路由的匹配规则
      const matchedRegexp = matchedRoute.regex
      // 遍历当前的菜单，然后匹配路径
      let tempMenu, menuId
      for (menuId in this.menuCache) {
        tempMenu = this.menuCache[menuId]
        // 跳过菜单分组
        if (tempMenu.children && tempMenu.children.length) {
          continue
        }
        if (!tempMenu.path) {
          continue
        }
        // 匹配第一个菜单
        if (matchedRegexp.test(tempMenu.path)) {
          this.defaultActive = menuId
          return
        }
      }
    },
    handleMenuLoadCallback (treeList) {
      this.menuTree = treeList || []
      // 计算缓存
      this.initMenuCache(this.menuTree)
      // 计算菜单高亮
      this.initDefaultActive()
      // 通知加载完成事件
      this.$emit('loaded', this.listData)
    },
    handleMenuSelect (index, indexPath) {
      // 查询
      const menu = this.menuCache[index]
      if (this.menuClick) {
        this.menuClick(menu)
        return
      }
      // 跳转
      if (menu.url) {
        this.$router.push(menu.url)
      }
    }
  }
}
</script>

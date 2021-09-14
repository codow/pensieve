<template>
  <div class="padding__small">
    <div>测试el-table</div>
    <div>
      <el-table :data="list">
        <el-table-column label="#"
                         type="index"></el-table-column>
        <el-table-column label="合同ID"
                         prop="contract_id"></el-table-column>
        <el-table-column label="合同名称"
                         prop="contract_name"></el-table-column>
        <el-table-column label="签约时间"
                         prop="create_time"></el-table-column>
      </el-table>
    </div>
    <div>列拖拽测试</div>
    <div>
      <vue-draggable tag="el-table"
                     :attrs="{
                        data: list
                      }">
        <el-table-column label="#"
                         type="index"></el-table-column>
        <el-table-column label="合同ID"
                         prop="contract_id"></el-table-column>
        <el-table-column label="合同名称"
                         prop="contract_name"></el-table-column>
        <el-table-column label="签约时间"
                         prop="create_time"></el-table-column>
      </vue-draggable>
    </div>

    <div>列拖拽测试</div>
    <div>
      <div>{{columns}}</div>
      <div>{{loaded + ''}}</div>
      <el-table v-if="loaded"
                ref="table3"
                :data="list"
                header-row-class-name="drag-row"
                @row-contextmenu="handleRowContextMenu">
        <el-table-column v-for="(column, i) in columns"
                         :key="column.id"
                         :type="column.type"
                         :label="column.label"
                         :prop="column.value"
                         :fixed="column.fixed">
          <template #header>
            <div :index="i"
                 :column-id="column.id"
                 class="drag-cell">
              <i class="drag-icon el-icon-rank"></i>
              {{column.label}}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 菜单弹框 -->
    <div ref="menu"
         class="table-cell-menu">
      <div v-for="item in menuInfo.menus"
           :key="item.value"
           class="table-cell-menu-item padding-horizontal__small"
           @click="handleCellMenuClick(item)">
        {{item.label}}
      </div>
    </div>
  </div>
</template>

<style>
.drag-cell.sortable-fallback {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fff;
  width: auto !important;
  height: auto !important;
  padding: 15px 10px;
  color: #909399;
  font-size: 14px;
  font-weight: 600;
  opacity: 1 !important;
}

.drag-icon {
  display: none;
}

.drag-cell.sortable-fallback .drag-icon {
  display: inline;
}

.drag-cell.drag-copied {
  visibility: hidden;
  position: absolute;
}

.drop-in-left {
  border-left: 1px solid #0063ff;
}
.drop-in-right {
  border-right: 1px solid #0063ff;
}

.table-cell-menu {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fff;
  width: 240px;
  position: absolute;
  z-index: 1;
  display: none;
  font-size: 14px;
  color: #909399;
}

.table-cell-menu-item {
  line-height: 26px;
}

.table-cell-menu-item:hover {
  color: #fff;
  background-color: orange;
}
</style>

<script>
import VueDraggable from 'vuedraggable'
import Sortable from 'sortablejs'

const addClass = function (el, className) {
  if (!el || !el.classList) return
  el.classList.add(className)
}

const delClass = function (el, className) {
  if (!el || !el.classList) return
  el.classList.remove(className)
}

export default {
  name: 'demo-el-table',

  components: {
    VueDraggable
  },

  data () {
    return {
      loaded: true,
      list: [{
        contract_id: 1,
        contract_name: '3A游戏开发合同',
        contract_amount: 60000000,
        create_time: '2020-12-10 12:23:12'
      }],
      columns: [{
        id: 1,
        type: 'index',
        label: '#'
      }, {
        id: 2,
        label: '合同ID',
        value: 'contract_id',
        value_type: 'int'
      }, {
        id: 3,
        label: '合同名称',
        value: 'contract_name',
        value_type: 'varchar2'
      }, {
        id: 4,
        label: '签约时间',
        value: 'create_time',
        value_type: 'datetime'
      }],
      menuInfo: {
        menus: []
      }
    }
  },

  mounted () {
    setTimeout(() => {
      this.initDragArea()
    })
    this.initMenu()
  },

  destroyed () {
    this.destroyDragArea()

    this.destroyMenu()
  },

  methods: {
    initDragArea () {
      const { table3 } = this.$refs
      const table3El = table3.$el
      // 
      const dragThs = table3El.querySelectorAll("thead .drag-row th .cell")
      // 初始化拖拽容器
      this.dragInstances = []
      const { columns } = this
      const _vm = this
      let i, l, th
      for (i = 0, l = dragThs.length; i < l; i++) {
        th = dragThs[i]
        this.dragInstances.push(new Sortable(th, {
          group: {
            name: 'column',
            pull: 'clone'
          },
          draggable: '.drag-cell',
          forceFallback: true,
          fallbackOnBody: true,
          onStart (evt) {
            // 获取table的位置
            const dragItem = document.querySelector('.drag-cell.sortable-fallback')
            _vm.dragItem = dragItem
            table3El.addEventListener('mousemove', _vm.handleMouseMove)
            table3El.addEventListener('mouseleave', _vm.handleMouseLeave)
            window.addEventListener('mousemove', _vm.handleGlobalMouseMove)
          },
          onChange (evt) {
            // 获取当前元素对应的列
            const { item, from, to } = evt
            // 不需要交换
            if (from === to) return
            _vm.clearDropClass()
            // 获取相邻的列
            let isLeft = to.childNodes[0] === item
            // 加载样式
            let columnClass = to.parentNode.classList[0]
            const tds = table3El.querySelectorAll('.' + columnClass)
            tds.forEach(td => {
              if (isLeft) {
                addClass(td, 'drop-in-left')
                delClass(td, 'drop-in-right')
              } else {
                addClass(td, 'drop-in-right')
                delClass(td, 'drop-in-left')
              }
            })
          },
          onMove (evt) {
            // 判断是否交换了容器
            const { from, to, dragged } = evt
            if (from !== to) {
              addClass(dragged, 'drag-copied')
            } else {
              delClass(dragged, 'drag-copied')
            }
          },
          onEnd (evt) {
            _vm.clearDropClass()
            table3El.removeEventListener('mousemove', _vm.handleMouseMove)
            table3El.removeEventListener('mouseleave', _vm.handleMouseLeave)
            window.removeEventListener('mousemove', _vm.handleGlobalMouseMove)
            // 删除复制的元素
            const { clone, item, from, to } = evt
            // 数据交换处理
            let id = item.getAttribute('column-id')
            let index = columns.findIndex(col => col.id + '' === id)
            let column = columns[index]
            let needRefresh = false
            if (_vm.dropType === 'remove') {
              columns.splice(index, 1)
              needRefresh = true
            } else if (_vm.dropType === 'fixed-left') {
              _vm.$set(column, 'fixed', 'left')
              needRefresh = true
              // 同时交换位置
              if (to) _vm.dropType = 'change'
            } else if (_vm.dropType === 'fixed-right') {
              _vm.$set(column, 'fixed', 'right')
              needRefresh = true
              // 同时交换位置
              if (to) _vm.dropType = 'change'
            }
            if (_vm.dropType === 'change') {
              // 不需要交换
              if (from === to) return
              // 获取相邻的列
              const { childNodes } = to
              let otherItem, otherId
              let type
              if (childNodes[0] === item) {
                type = 'left'
                otherItem = childNodes[1]
              } else {
                type = 'right'
                otherItem = childNodes[0]
              }
              otherId = otherItem.getAttribute('column-id')
              _vm.$set(column, 'fixed', otherItem.fixed)
              // 获取列配置中的排序
              let otherIndex = columns.findIndex(col => col.id + '' === otherId)
              // 排除不需要重新排序的情况
              if (type === 'left' && index + 1 === otherIndex) return
              if (type === 'right' && index - 1 === otherIndex) return
              let newIndex = otherIndex
              if (type === 'left' && index < otherIndex) {
                newIndex = otherIndex - 1
              }
              // 交换顺序
              columns.splice(newIndex, 0, columns.splice(index, 1)[0])
              needRefresh = true
            }
            // 删除多余元素
            if (!from.contains(item)) {
              // 将原始组件插入到开始拖拽的位置
              from.insertBefore(item, clone)
              clone.remove()
            }
            delClass(item, 'drag-copied')
            if (needRefresh) _vm.refresh()
          }
        }))
      }
    },

    destroyDragArea () {
      if (!this.dragInstances) return
      this.dragInstances.forEach(item => {
        item.destroy()
      })
      this.dragInstances = null
    },

    initMenu () {
      const { menu } = this.$refs
      this.menuEl = menu
      // 移动到body上
      window.document.body.append(menu)
    },

    destroyMenu () {
      this.menuEl.destroy()
      this.menuEl = null
    },

    clearDropClass () {
      const table3El = this.$refs.table3.$el
      let els = table3El.querySelectorAll('.drop-in-left')
      els.forEach(el => delClass(el, 'drop-in-left'))
      els = table3El.querySelectorAll('.drop-in-right')
      els.forEach(el => delClass(el, 'drop-in-right'))
    },
    
    handleGlobalMouseMove (evt) {
      // 更新拖拽元素的定位
      const { dragItem } = this
      const { style } = dragItem
      let left = Number.parseFloat(style.left)
      let top = Number.parseFloat(style.top)
      style.transform = `matrix(1, 0, 0, 1, ${evt.x - left - 5}, ${evt.y - top - 5})`
    },

    handleMouseMove (evt) {
      const table3El = this.$refs.table3.$el
      const iconEl = this.dragItem.querySelector('.drag-icon')
      // 如果移动到左边
      if (evt.clientX - table3El.offsetLeft < 60) {
        // 调整图表样式
        iconEl.className = 'drag-icon el-icon-place'
        this.dropType = 'fixed-left'
      } else if (table3El.offsetLeft + table3El.offsetWidth - evt.clientX < 60) {
        iconEl.className = 'drag-icon el-icon-place'
        this.dropType = 'fixed-right'
      } else {
        iconEl.className = 'drag-icon el-icon-rank'
        this.dropType = 'change'
      }
    },

    handleMouseLeave (evt) {
      const iconEl = this.dragItem.querySelector('.drag-icon')
      iconEl.className = 'drag-icon el-icon-turn-off'
      this.dropType = 'remove'
    },

    handleRowContextMenu (row, column, event) {
      // 避免冒泡和默认事件
      event.stopPropagation()
      event.preventDefault()
      // property
      let property = column.property
      // 没有显示数据的列，不提供菜单
      if (!property) return
      let cellValue = row[property]
      // 查询配置
      let col = this.columns.find(item => item.value === property)
      const commonMenus = [
        { value: 'EQUAL', label: '等于...', sort: 21 },
        { value: 'UNEQUAL', label: '不等于...', sort: 22 },
        { value: 'IS_NULL', label: '没有值...', sort: 81 },
        { value: 'IS_NOT_NULL', label: '有值...', sort: 82 }
      ]
      const stringMenus = [
        { value: 'LIKE', label: '包含...', sort: 11 },
        { value: 'NOT_LIKE', label: '不包含...', sort: 12 },
        { value: 'LIKE_RIGHT', label: '开始以...', sort: 51 },
        { value: 'NOT_LIKE_RIGHT', label: '开始不是以...', sort: 52 },
        { value: 'LIKE_LEFT', label: '结束以...', sort: 53 },
        { value: 'NOT_LIKE_LEFT', label: '结束不是以...', sort: 54 },
      ]

      const numberMenus = [
        { value: 'GT', label: '大于...', sort: 31 },
        { value: 'LT', label: '小于...', sort: 32 },
        { value: 'GT_EQUAL', label: '大于等于...', sort: 33 },
        { value: 'LT_EQUAL', label: '小于等于...', sort: 34 }
      ]

      const numberTypes = ['numeric', 'int', 'tinyint', 'smallint', 'bigint', 'double', 'decimal']
      const dateTypes = ['date', 'datetime', 'timestamp']
      const stringStypes = ['varchar', 'varchar2', 'char', 'text', 'mediumtext', 'longtext']

      const valueType = (col.value_type || '').toLowerCase()
      // 根据数据类型判断打开什么菜单
      let menus = [].concat(commonMenus)
      if (numberTypes.includes(valueType) || dateTypes.includes(valueType)) {
        menus = menus.concat(numberMenus)
      } else if (stringStypes.includes(valueType)) {
        menus = menus.concat(stringMenus)
      }
      // 排序
      menus.sort((a, b) => a.sort - b.sort)

      // 记录选择的单元格
      this.menuInfo = {
        row: row,
        column: column,
        cellValue: cellValue,
        menus: menus
      }
      // 打开弹框
      this.openMenu(event.x, event.y)
    },

    handleCellMenuClick (menu) {
      // 设置过滤信息
      let filterType = menu.value
      let filterValue = this.menuInfo.cellValue
      this.closeMenu()
      alert('查询满足 ' + menu.label.replace('...', this.menuInfo.cellValue) + ' 的数据')
    },

    openMenu (x, y) {
      this.menuEl.style = `display: block; position: absolute; left: ${x - 5}px; top: ${y - 5}px;`
      // 监听全局按键
      window.addEventListener('click', this.closeMenu)
    },

    closeMenu () {
      this.menuEl.style = ''
      window.removeEventListener('click', this.closeMenu)
    },

    refresh () {
      this.destroyDragArea()
      this.loaded = false
      this.$nextTick(() => {
        this.loaded = true
        this.$nextTick(() => {
          this.initDragArea()
        })
      })
    }
  }
}
</script>

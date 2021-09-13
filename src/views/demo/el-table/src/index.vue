<template>
  <div>
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
                header-row-class-name="drag-row">
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
        value: 'contract_id'
      }, {
        id: 3,
        label: '合同名称',
        value: 'contract_name'
      }, {
        id: 4,
        label: '签约时间',
        value: 'create_time'
      }]
    }
  },

  mounted () {
    setTimeout(() => {
      this.initDragArea()
    })
  },

  destroyed () {
    this.destroyDragArea()
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
          onAdd (evt) {
            // // 获取当前元素对应的列
            // const { item, from, to } = evt
            // // 不需要交换
            // if (from === to) return
            // // 获取列ID
            // let id = item.getAttribute('column-id')
            // // 获取相邻的列
            // const { childNodes } = to
            // let otherItem, otherId
            // let type
            // if (childNodes[0] === item) {
            //   type = 'left'
            //   otherItem = childNodes[1]
            // } else {
            //   type = 'right'
            //   otherItem = childNodes[0]
            // }
            // otherId = otherItem.getAttribute('column-id')
            // // 获取列配置中的排序
            // let index = columns.findIndex(col => col.id + '' === id)
            // let otherIndex = columns.findIndex(col => col.id + '' === otherId)
            // // 排除不需要重新排序的情况
            // if (type === 'left' && index + 1 === otherIndex) return
            // if (type === 'right' && index - 1 === otherIndex) return
            // let newIndex = otherIndex
            // if (type === 'left' && index < otherIndex) {
            //   newIndex = otherIndex - 1
            // }
            // // 交换顺序
            // columns.splice(newIndex, 0, columns.splice(index, 1)[0])
            // _vm.refresh()
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

    clearDropClass () {
      const table3El = this.$refs.table3.$el
      let els = table3El.querySelectorAll('.drop-in-left')
      els.forEach(el => delClass(el, 'drop-in-left'))
      els = table3El.querySelectorAll('.drop-in-right')
      els.forEach(el => delClass(el, 'drop-in-right'))
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

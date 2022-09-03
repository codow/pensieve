<template>
  <div class="designer-outline-item">
    <div class="designer-outline-item__header">
      <i v-if="true"
         class="designer-outlint-item__collapse-btn el-icon-arrow-up"></i>
      <i v-else
         class="designer-outlint-item__collapse-btn el-icon-arrow-down"></i>
      <span>{{label}}</span>
    </div>
    <div class="designer-outline-item__body">
      <div v-for="slotItem in slots"
           :key="slotItem.name"
           class="designer-outline-item-slot">
        <el-divider content-position="left">{{slotItem.name}}</el-divider>
        <!-- :group="{ name: 'form', pull: 'clone' }" -->
        <draggable class="drag-container"
                   :list="slotItem.components"
                   :data-comp-id="id"
                   :data-slot-name="slotItem.name"
                   group="form"
                   draggable=".draggable"
                   chosen-class="drag-item__chosen"
                   ghost-class="drag-item__ghost"
                   :class="{'z-without-children': !slotItem.components.length }"
                   :set-data="dragSetData"
                   :move="dragMove"
                   :clone="defineClone"
                   :options="{ swap: true, swapClass: 'highlighted' }"
                   @start="dragStart"
                   @end="dragEnd"
                   @add="dragAdd">
          <form-designer-outline-item v-for="(subItem, index) in slotItem.components"
                                      :key="index"
                                      :define="subItem"
                                      class="draggable">
          </form-designer-outline-item>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import { isArray, isObject } from '../../../utils/packages/validator'
import { addClass, removeClass } from '../../../utils/packages/dom'

import _ from 'lodash'

import Draggable from 'vuedraggable'

let dragImage = null

export default {
  name: 'form-designer-outline-item',

  inject: ['designerPage'],

  components: {
    Draggable
  },

  props: {
    define: Object
  },

  computed: {
    id () {
      return this.designerAttributes.id
    },
    tag () {
      return this.define.tag
    },
    attributes () {
      return this.define.attributes || {}
    },
    designerAttributes () {
      return this.define.designer_attributes || {}
    },
    label () {
      return this.designerAttributes.label || this.tag
    },
    slots () {
      let children = this.define.children || {}
      if (isArray(children)) {
        children = {
          default: {
            componets: children
          }
        }
      }
      let slots = (this.designerAttributes.slots || []).map((item) => {
        if (!item.opened) {
          return null
        }
        let components = children[item.name]
        if (isObject(components)) {
          components = components.components || []
        } else {
          components = components || []
        }
        components = [].concat(components)
        return {
          name: item.name,
          components
        }
      }).filter(item => !!item)
      console.log('computed slots', slots)
      return slots
    }
  },

  methods: {
    defineClone () {
      return _.cloneDeep(this.define)
    },
    dragSetData (dataTransfer, srcEl) {
      let dragImage = this.designerPage.drag.image
      if (dragImage) {
        dragImage.remove()
      }
      // 创建拖拽样式
      dragImage = document.createElement('div')

      // 数据调整
      dragImage.innerHTML = `<div class="drag-item-title">组件</div>
      <div class="drag-item-line">
        <div class="drag-item-line__dot"></div>
      </div>`
      dragImage.style.position = 'absolute'
      dragImage.style.left = '-10000px'
      dragImage.style.top = '-10000px'
      dragImage.style.display = 'inline'
      dragImage.style.padding = '10px'
      document.body.appendChild(dragImage)
      dataTransfer.setDragImage(dragImage, 0, 0)
      this.designerPage.drag.image = dragImage
    },
    dragStart (event) {
      console.log('dragStart', event)
      // 记录开始的拖拽容器
      this.designerPage.drag.fromEl = event.from
      // 找到被拖拽的元素，添加显示的元素
      addClass(event.item, 'drag-item-clone')
      addClass(event.from, 'drag-from-container')
      let lineEl = document.createElement('div')
      lineEl.className = 'drag-item-line'
      lineEl.innerHTML = '<div class="drag-item-line__dot"></div>'
      event.item.appendChild(lineEl)
    },
    dragEnd (event) {
      console.log('dragEnd', event)
      // 找到被拖拽的元素，添加显示的元素
      removeClass(event.item, 'drag-item-clone')
      removeClass(event.from, 'drag-from-container')
      // 删除
      let lineEl = event.item.querySelector('.drag-item-line')
      lineEl && lineEl.remove()
      // 清除每次拖拽的缓存
      this.designerPage.drag.fromEl = null
      this.designerPage.drag.toEl = null
    },
    dragAdd (event) {
      // 设置当前组件的值
      // console.log('dragAdd', event)
      // 查看当前的拖拽数据
      // console.log('dragData', this.designerPage.drag.data)
      // 获取插槽对应的数据集合
      let fromCompId = event.from.dataset.compId
      let fromSlotName = event.from.dataset.slotName
      let toCompId = event.to.dataset.compId
      let toSlotName = event.to.dataset.slotName
      // 通知设计器，更新属性
      this.designerPage.dropComponent(this.designerPage.drag.data, toCompId, toSlotName, event.newIndex, fromCompId, fromSlotName, event.oldIndex)
    },
    dragMove (event) {
      // console.log('dragMove', dragMove)
    }
  }
}
</script>
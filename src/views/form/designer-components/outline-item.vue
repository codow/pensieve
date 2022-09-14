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
        <draggable class="drag-container"
                   :list="slotItem.components"
                   :data-comp-id="id"
                   :data-slot-name="slotItem.name"
                   group="form"
                   draggable=".draggable"
                   :plain="true"
                   @sort="dragSort">
          <form-designer-outline-item v-for="subItem in slotItem.components"
                                      :key="subItem.designer_attributes.id"
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

let dragImage = null

export default {
  name: 'form-designer-outline-item',

  inject: ['designerPage'],

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
      // console.log('computed slots', slots)
      return slots
    }
  },

  methods: {
    defineClone () {
      return _.cloneDeep(this.define)
    },
    dragSort (event) {
      // 获取插槽对应的数据集合
      let fromCompId = event.from.dataset.compId
      let fromSlotName = event.from.dataset.slotName
      let toCompId = event.to.dataset.compId
      let toSlotName = event.to.dataset.slotName
      if (fromCompId === this.id && toCompId !== this.id) {
        return
      }
      // 通知设计器，更新属性
      this.designerPage.dropComponent(null, toCompId, toSlotName, event.newIndex, fromCompId, fromSlotName, event.oldIndex)
    }
  }
}
</script>
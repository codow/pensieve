<template>
  <el-container class="fr-full">
    <el-header style="border-bottom: 1px solid #DCDFE6;">
      <div>表单设计</div>
    </el-header>
    <el-container style="height: calc(100% - 60px);">
      <el-aside width="240px"
                style="border-right: 1px solid #DCDFE6; overflow: auto;">
        <el-collapse class="designer-tools__group"
                     v-model="activeNames">
          <template v-for="item in tools">
            <el-collapse-item :key="item.tag"
                              :title="item.label"
                              :name="item.tag">
              <draggable class="tools-list__wrapper drag-container"
                         :sort="false"
                         :group="{ name: 'form', pull: 'clone', put: false }"
                         :list="item.children"
                         :clone="toolClone"
                         :set-data="dragSetData"
                         v-show="!item.close"
                         :move="dragMove"
                         @start="dragStart"
                         @end="dragEnd"
                         @clone="dragClone">
                <template v-for="sub in item.children">
                  <div :key="sub.tag"
                       class="tools-list__item-wrap">
                    <div class="tools-list__item tools-list__card"
                         @dblclick="dblclickTool(sub)"
                         :title="sub.label">
                      <span>{{sub.label}}</span>
                      <sp-svg-icon v-if="sub.icon && sub.icon.indexOf('sp') === 0"
                                   class="tools-list__item-icon"
                                   icon-class="sp-password" />
                      <em v-else
                          class="tools-list__item-icon"
                          :class="sub.icon || 'el-icon-setting'"></em>
                    </div>
                  </div>
                </template>
              </draggable>
            </el-collapse-item>
          </template>
        </el-collapse>
      </el-aside>
      <el-aside width="240px"
                style="border-right: 1px solid #DCDFE6; overflow: auto;">
        <draggable v-if="!page.define"
                   class=" drag-container fr-full"
                   :list="currentSlot"
                   group="form"
                   draggable=".draggable"
                   chosen-class="drag-item__chosen"
                   ghost-class="drag-item__ghost"
                   style="height: calc(100% - 20px);"
                   :set-data="dragSetData"
                   @add="dragAdd">
        </draggable>
        <outline v-else
                 ref="outline"
                 :define="page.define"></outline>
      </el-aside>
      <el-main ref="designerContainer"
               class="sf-designer__designer-area"
               style="padding: 0px;">
        <div class="sf-designer__designer-area-content">
          <div ref="canvasWrapper"
               class="sf-designer__designer-canvas-wrapper fr-full"
               v-loading="pageLoading">
            <designer-dynamic-template v-if="page.define"
                                       :page="page"></designer-dynamic-template>
          </div>
        </div>
      </el-main>
      <el-aside width="240px"
                style="border-left: 1px solid #DCDFE6;"></el-aside>
    </el-container>
  </el-container>
</template>

<style>
ol,
ul {
  list-style: none;
}
.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
}

.clearfix:after {
  clear: both;
}

.clearfix {
  zoom: 1;
}
article,
aside,
blockquote,
body,
button,
code,
dd,
details,
div,
dl,
dt,
fieldset,
figcaption,
figure,
footer,
form,
h1,
h2,
h3,
h4,
h5,
h6,
header,
hgroup,
hr,
input,
legend,
li,
menu,
nav,
ol,
p,
pre,
section,
select,
strong,
td,
textarea,
th,
ul {
  margin: 0;
  padding: 0;
  font-family: Microsoft YaHei;
  font-weight: 400;
}
</style>

<style>
.designer-tools__group .el-collapse-item__content {
  padding: 0 10px 10px 0;
}

.designer-tools .el-collapse-item__header {
  height: 30px;
}

.designer-tools__group .el-collapse-item__header {
  padding-left: 10px;
  background-color: #1890ff0d;
}

.designer-tools__group .tools__wrapper {
  display: -moz-flex;
  display: -webkit-flex;
  display: -o-flex;
  display: flex;
  -webkit-flex-direction: row;
  -moz-flex-direction: row;
  -o-flex-direction: row;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.designer-tools__group .tools__item {
  -webkit-flex: 1;
  -ms-flex: 1;
  -o-flex: 1;
  flex: 1;
  flex-basis: 100px;
  flex-grow: 0;
  width: 100px;
  margin: 10px;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
}

.designer-tools__group .tools__item i {
  font-size: 36px;
  display: block;
  margin: 0 auto;
}

.designer-tools__group .tools-list__wrapper {
  line-height: 20px;
}

.tools-list__item-wrap {
  display: inline-block;
  width: 50%;
  /* float: left; */
  box-sizing: border-box;
  padding: 10px 0 0 10px;
}

.designer-tools__group .tools-list__wrapper .tools-list__item {
  border-bottom: 1px dashed #e7e8eb;
  padding: 5px 0px;
  text-align: left;
  position: relative;
  cursor: pointer;
}

.designer-tools__group
  .tools-list__wrapper
  .tools-list__item.tools-list__card:hover {
  border: 1px dashed #1890ff;
}

.designer-tools__group
  .tools-list__wrapper
  .tools-list__item.tools-list__card:hover
  .tools-list__item-icon,
.designer-tools__group
  .tools-list__wrapper
  .tools-list__item.tools-list__card:hover
  span {
  color: #1890ff;
}

.designer-tools__group .tools-list__wrapper .tools-list__item-icon {
  position: absolute;
  height: 30px;
  line-height: 30px;
  top: 0px;
  right: 5px;
  font-size: 18px;
  color: #0db3a6;
}

.designer-tools__group .tools-list__wrapper .tools-list__item.tools-list__card {
  border: 1px solid hsla(0, 0%, 43.9%, 0.2196078431372549);
  border-radius: 3px;
  padding-left: 5px;
  padding-right: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}

.designer-tools__group
  .tools-list__wrapper
  .tools-list__item.tools-list__card:nth-child(even) {
  margin-left: 20px;
}

.designer-tools__group
  .tools-list__wrapper
  .tools-list__item.tools-list__card
  .tools-list__item-icon {
  top: 0px;
  font-size: 18px;
}

.designer-tools__group .el-scrollbar__view {
  height: auto;
}
</style>

<style>
.no-padding .portlet-panel__main {
  padding: 0px;
}

.sf-designer__designer-area {
}

.sf-designer__designer-area-header {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.sf-designer__designer-path-wrap {
  display: table-cell;
  width: 100%;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sf-designer__designer-area-content {
  /* padding: 20px 0 0 20px; */
  height: 100%;
  background-color: #fafafa;
  box-sizing: border-box;
  position: relative;
}

.sf-designer__axis-screen {
  position: absolute;
  left: 0;
  top: 0;
  width: 20px;
  height: 20px;
  z-index: 1;
}

.sf-designer__axis-x {
  width: 100%;
  height: 20px;
  position: absolute;
  left: 0;
  top: 0;
  padding-left: 20px;
  overflow: hidden;
}

.sf-designer__axis-y {
  width: 20px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding-top: 20px;
  overflow: hidden;
}

.sf-designer__axis-x span {
  color: #afafaf;
  font-size: 10px;
}

.sf-designer__axis-y span {
  color: #afafaf;
  padding-left: 2px;
  font-size: 10px;
  transform: rotate(90deg);
  display: block;
}

.sf-designer__axis-x-p-wrapper {
  list-style: none;
  /* box-sizing: border-box; */
  border-bottom: 1px solid #afafaf;
}

.sf-designer__axis-y-p-wrapper {
  list-style: none;
  /* box-sizing: border-box; */
  border-right: 1px solid #afafaf;
}

/* x刻度 */
.sf-designer__axis-x-p {
  width: 0px;
  height: 5px;
  margin-left: 9px;
  border-left: 1px solid #afafaf;
  float: left;
  margin-top: 15px;
}

.sf-designer__axis-x-p.z-large {
  height: 20px;
  margin-top: 0px;
}

.sf-designer__axis-x-p.z-middle {
  height: 10px;
  margin-top: 10px;
}
.sf-designer__axis-x-p.z-middle span {
  position: relative;
  top: -10px;
}

.sf-designer__axis-x-p:first-child {
  margin-left: 0px;
}

/* y刻度 */
.sf-designer__axis-y-p {
  width: 5px;
  height: 0px;
  margin-top: 9px;
  border-top: 1px solid #afafaf;
  margin-left: 15px;
}

.sf-designer__axis-y-p.z-large {
  width: 20px;
  margin-left: 0px;
}

.sf-designer__axis-y-p.z-middle {
  width: 10px;
  margin-left: 10px;
}

.sf-designer__axis-y-p.z-middle span {
  margin-left: -10px;
}

.sf-designer__axis-y-p:first-child {
  margin-top: 0px;
}

.sf-designer__designer-canvas-wrapper {
  /* padding: 20px; */
  position: relative;
  overflow: auto;
  box-sizing: border-box;
  background-color: #ffffff;
}

.sf-designer__designer-canvas {
  position: absolute;
}

.sf-designer__designer-status-bar {
  height: 40px;
  width: 158px;
  display: table-cell;
}

.sf-designer__designer-status-content {
  height: 30px;
  text-align: right;
}

.sf-designer__designer-status-item {
  display: inline-block;
}

.sf-designer__designer-status-item .sf-designer__status-btn {
  font-size: 18px;
  padding: 0px;
  vertical-align: middle;
}

.sf-designer__designer-status-item + .sf-designer__designer-status-item {
  margin-left: 10px;
}

.sf-designer__designer-scale-slider {
  width: 80px;
}

.designer-page__component.sf-drag-item__chosen,
.designer-page__component.z-activated.sf-drag-item__chosen {
}

.designer-page__component.sf-drag-item__ghost,
.designer-page__component.z-activated.sf-drag-item__ghost {
  border: none;
  border-left: 2px solid #68e;
  width: 0;
  height: 40px;
  overflow: hidden;
  display: block;
}

.sf-designer__breadcrumb {
  white-space: nowrap;
  width: fit-content;
}

.sf-designer__breadcrumb-item {
  display: inline-flex;
  float: none;
}
.sf-designer__breadcrumb .el-breadcrumb__inner {
  color: #0a5cdb;
  cursor: pointer;
  line-height: inherit;
}
</style>

<style>
/* .drag-container.z-without-children {
  background-image: linear-gradient(
    135deg,
    #e7e8eb 25%,
    transparent 0px,
    transparent 50%,
    #e7e8eb 0px,
    #e7e8eb 75%,
    transparent 0px
  );
  background-size: 40px 40px;
  min-width: 100px;
  min-height: 38px;
} */

.drag-container {
  min-height: 20px;
  padding-bottom: 20px;
  background-image: linear-gradient(
    135deg,
    #e7e8eb 25%,
    transparent 0px,
    transparent 50%,
    #e7e8eb 0px,
    #e7e8eb 75%,
    transparent 0px
  );
  background-size: 40px 40px;
}
</style>

<script>
import { isArray, isString, isObject } from '../../utils/packages/validator'
import { uuid } from '../../utils/packages/string'
import { addClass, removeClass } from '../../utils/packages/dom'

import _ from 'lodash'

import ToolsData from './tools.json'

import draggable from 'vuedraggable'

import ResizeObserver from 'resize-observer-polyfill'

import DesignerDynamicTemplate from './designer-dynamic-template.vue'

import Outline from './designer-components/outline.vue'

const DELETE_FIELDS = ['create_user_id', 'create_time', 'create_user_name', 'create_time_format', 'modify_user_id', 'modify_time', 'modify_user_name', 'modify_time_format', 'app_type', 'os_type', 'device_type', 'framework_type', 'app_type_format', 'os_type_format', 'device_type_format', 'framework_type_format', 'is_deleted', 'sf_component_group_id', 'sf_component_info_id', 'sort', 'name_en', 'name_ch', 'version', 'component_define', 'description', 'is_leaf', 'is_tool']

const cleanToolData = function (data) {
  if (!data) return data
  if (isArray(data)) {
    return data.map(item => cleanToolData(item))
  }
  if (!isObject(data)) {
    return data
  }
  // 改变属性名
  data.id = data.id || data.sf_component_group_id || data.sf_component_info_id
  data.tag = data.tag || data.name_en
  data.label = data.label || data.name_ch
  // 移除多余数据
  DELETE_FIELDS.map(field => delete data[field])
  // 移除下级数据
  if (data.children) {
    data.type = 'group'
    data.children = cleanToolData(data.children)
  } else {
    data.type = 'comp'
  }
  return data
}

export default {
  name: 'form-designer-view',

  components: {
    draggable,
    Outline,
    DesignerDynamicTemplate
  },

  provide () {
    return {
      designerPage: this
    }
  },

  props: {
    showHeader: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: false
    },
    canvasWidth: {
      type: Number
    },
    canvasHeight: {
      type: Number
    },
    axisPrecision: {
      type: Number,
      default: 20
    },
    scale: {
      type: Number,
      default: 1
    },
    path: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      loading: false,
      pageLoading: false,
      // tools: cleanToolData(_.cloneDeep(ToolsData))
      tools: ToolsData,
      activeNames: [],
      fields: {},
      // 初始化时，没有页面信息，拖入任意组件，都将被作为顶级组件
      page: {
        model: null,
        define: null
      },
      currentSlot: [],
      drag: {
        image: null,
        data: null,
        oldId: null,
        newId: null
      }
    }
  },

  computed: {
    meta () {
      return this.componentDefine.meta || {}
    },

    designerPageData () {
      return Object.assign({}, this.pageData)
    },

    defaultDragList () {
      return []
    }
  },

  methods: {
    toolClone (data, options) {
      // 提取组件信息
      let component = {}
      component.tag = data.tag
      component.attributes = data.attributes || {}
      component.designer_attributes = {
        id: uuid(),
        component_id: data.id,
        slots: data.slots
      }
      this.drag.data = component
      return component
    },

    dblclickTool (data) {
      data = this.toolClone(data)
      //
      this.$emit('dblclickTool', data)
    },

    toolDragStart (event, sub) {
      this.$emit('tool-drag-start', event, sub)
    },

    /**
     * 根据组件的标签或者组件ID来查询组件
     */
    findTool (options) {
      return this.toolClone(this.findToolInfo(options), options)
    },

    /**
     * 根据组件的标签或者组件ID来查询组件
     */
    findToolInfo (options) {
      //
      let component = this.utils.findDeep(this.toolList, options)
      return component
    },

    getAllTools (toolList) {
      let tools = []
      toolList = toolList || this.toolList
      for (let tool of toolList) {
        if (tool && tool[this.props.componentValue]) {
          tools.push(tool)
        } else if (tool && tool[this.props.children]) {
          tools = tools.concat(this.getAllTools(tool[this.props.children]))
        }
      }
      return tools
    },

    defaultDragChoose (event) {
      // 获取选中的元素的下标
      let index = event.oldIndex
      if (index === this.defaultDragList.length) index--
      let item = this.defaultDragList[index]
      // 触发选中事件
      this.eventBus.$emit('chooseItem', item)
    },

    designerPageLoading (flag, lazy) {
      if (lazy) {
        setTimeout(() => {
          this.pageLoading = flag
        }, 50)
      } else {
        this.pageLoading = flag
      }
    },

    getPathItemLabel (item) {
      let defaultLabel = '组件'
      if (!item) return defaultLabel
      if (!item.sf_attributes) return item.label || defaultLabel
      return item.sf_attributes.label || item.sf_attributes.title || defaultLabel
    },

    dragSetData (dataTransfer, srcEl) {
      let dragImage = this.drag.image
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
      this.drag.image = dragImage
    },
    dragAdd (event) {
      let newIndex = event.newIndex
      let currentDefine = this.currentSlot.length <= newIndex ? this.currentSlot[this.currentSlot.length - 1] : this.currentSlot[newIndex]
      if (!this.page.define) {
        this.page.define = currentDefine
      } else {
        this.page.define = Object.assign({}, this.page.define)
      }
      if (currentDefine.designer_attributes && currentDefine.designer_attributes.slots) {
        currentDefine.children = {}
        let count = 0
        let currentSlotName = null
        currentDefine.designer_attributes.slots.forEach(item => {
          if (item.opened) {
            count++
            currentSlotName = item.name
            currentDefine.children[item.name] = {
              components: []
            }
          }
        })
        if (count === 1) {
          this.currentSlot = currentDefine.children[currentSlotName].components
        }
      }
      console.log(this.page)
    },
    dragStart (event) {
      console.log('dragStart', event)
      // 记录开始的拖拽容器
      this.drag.fromEl = event.from
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
      this.drag.fromEl = null
      this.drag.toEl = null
    },
    dragClone (event) {
    },
    dragMove (event) {
      let toEl = event.to
      if (this.drag.toEl === toEl) {
        return
      }
      if (this.drag.toEl) {
        removeClass(this.drag.toEl, 'drag-to-container')
      }
      this.drag.toEl = toEl
      // 给toEl加入样式控制
      addClass(toEl, 'drag-to-container')
    },
    dragChoose (event) {
      // 获取新拖入的元素的下标
      let index = event.oldIndex
      let children = this.componentDefine[this.fields.children]
      // 判断拖入的是那个插槽
      let target = event.target
      if (target.dataset && target.dataset.slotName) {
        // 设置插槽
        let tempChildren = []
        let slotName = target.dataset.slotName.toLocaleLowerCase()
        children.forEach(child => {
          let childSlot = child[this.fields.attributes][this.fields.slot] || 'default'
          childSlot = childSlot.toLocaleLowerCase()
          if (childSlot === slotName) {
            tempChildren.push(child)
          }
        })
        children = tempChildren
      }
      if (index === children.length) index--
      //
      let item = children[index]
      // 改为异步触发选中，避免触发选中时使之前的修改未保存
      setTimeout(() => {
        // 触发选中事件
        this.eventBusInstance.$emit('chooseItem', item)
        // 判断默认分组
        this.chooseItemSlot()
      })
    },
    dragRemove (event) {
      // 获取新拖入的元素的下标
      let index = event.oldIndex
      let children = this.componentDefine[this.fields.children]
      // 判断拖入的是那个插槽
      let target = event.target
      if (target.dataset && target.dataset.slotName) {
        // 设置插槽
        let tempChildren = []
        let slotName = target.dataset.slotName
        children.forEach(item => {
          // if (!item) return
          let itemGroup = item[this.fields.attributes][this.fields.slot] || 'default'
          itemGroup = itemGroup.toLocaleLowerCase()
          if (itemGroup === slotName) {
            tempChildren.push(item)
          }
        })
        children = tempChildren
      }
      if (index === children.length) index--
      //
      let item = children[index]
      // 触发选中事件
      this.eventBusInstance.$emit('unchooseItem')
      // 触发组件变更事件
      this.eventBusInstance.$emit('componentChange', this.componentDefine, item, 'remove')
    },
    dropComponent (compDefine, toCompId, toSlotName, toIndex, fromCompId, fromSlotName, fromIndex) {
      let parentDefine
      // 加入到新的组件中
      if (toCompId) {
        parentDefine = this.findCompDefine(this.page.define, toCompId)
        this.appendChildDefine(parentDefine, compDefine, toSlotName, toIndex)
        // console.log('pageDefine', this.page.define)
        // this.page.define = Object.assign({}, this.page.define)
      }
      // 从原来的组件中移除
      if (fromCompId) {
        parentDefine = this.findCompDefine(this.page.define, fromCompId)
        this.removeChildDefine(parentDefine, fromSlotName, fromIndex)
      }
      this.refreshOutline()
    },
    findCompDefine (defineList, compId) {
      let comp
      if (!defineList) return null
      if (isObject(defineList)) {
        defineList = [defineList]
      }
      if (!isArray(defineList)) return null
      comp = defineList.find(item => item.designer_attributes.id === compId)
      if (comp) {
        return comp
      }
      defineList.some(item => {
        if (!item.children) return false
        if (isArray(item.children)) {
          comp = this.findCompDefine(item.children, compId)
        } else if (isObject(item.children)) {
          for (let slotName in item.children) {
            if (isArray(item.children[slotName])) {
              comp = this.findCompDefine(item.children[slotName], compId)
            } else if (isObject(item.children[slotName]) && isArray(item.children[slotName].components)) {
              comp = this.findCompDefine(item.children[slotName].components, compId)
            }
            if (comp) {
              break
            }
          }
        }
        return !!comp
      })
      return comp
    },
    appendChildDefine (parentDefine, childDefine, slotName, index) {
      if (!childDefine || !parentDefine) return
      if (!parentDefine.children) {
        this.$set(parentDefine, 'children', {})
      }
      slotName = slotName || 'default'
      index = index || 0
      if (!parentDefine.children[slotName]) {
        this.$set(parentDefine.children, slotName, {
          components: []
        })
      }
      parentDefine.children[slotName].components.splice(index, 0, childDefine)
      // 更新children字段
      // parentDefine.children = Object.assign({}, parentDefine.children)
    },
    removeChildDefine (parentDefine, slotName, index) {
      if (!parentDefine) return
      if (!parentDefine.children) return
      slotName = slotName || 'default'
      index = index || 0
      if (!parentDefine.children[slotName]) return
      parentDefine.children[slotName].components.splice(index, 1)
      // 更新children字段
      // parentDefine.children = Object.assign({}, parentDefine.children)
    },
    deleteItem () {
      // 触发历史记录保存
      this.eventBusInstance.$emit('pushChangeHistory')
      this.eventBusInstance.$emit('deleteItem', this.componentDefine)
    },
    chooseItemSlot (name) {
      let slotName = this.defaultSlot
      // 获取当前被点击的拖拽组件的插槽名
      if (utils.validator.isString(name)) {
        slotName = name
      } else if (name instanceof Event) {
        let event = name
        let target = event.target
        if (target.dataset && target.dataset.slotName) {
          slotName = target.dataset.slotName
        }
      }
      // 修改当前组件选中的插槽
      this.selectedSlot = slotName
    },
    chooseItem () {
      // 改为异步触发选中，避免触发选中时使之前的修改未保存
      setTimeout(() => {
        // 没有选中插槽时，选中默认插槽
        if (!this.designerAttributes[this.designerFields.selectedSlot]) this.chooseItemSlot()
        this.eventBusInstance.$emit('chooseItem', this.componentDefine)
      })
    },
    refresh () {
      this.designerVisible = false
      this.$nextTick(() => {
        this.designerVisible = true
      })
    },
    refreshOutline () {
      const { outline } = this.$refs
      outline && outline.refresh()
    }
  }
}
</script>
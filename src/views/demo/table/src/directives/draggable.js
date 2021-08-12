/**
 * 拖拽指令，提供一系列拖拽功能的实现
 * 指令注册在容器上，会自动完成对子元素的拖拽功能启用
 * 拖拽相关的属性
 * v-draggable 指令
 * v-draggable={
 *  drag: true/false, 是否允许拖出子元素
 *  drop: true/false, 是否允许拖入子元素
 *  clone: true/false, 是否复制
 *  cloneMethod: function, hook方法，复制方法
 *  delay: 0, 拖拽响应延迟
 *  model: [], 拖拽模型，如果配置，则拖拽完成时，会进行数据交换
 *  dragAddMethod: function, hook方法，接管拖入方法
 *  dragRemoveMethod: function, hook方法，接管拖出方法
 * }
 * 
 * @author wangyubo
 * @createTime 2020-12-15 15:43:04
 */

/**
 * 基本配置
 */
const defaultConfig = {
  drag: true,
  drop: true,
  clone: false,
  cloneMethod: null,
  delay: 0,
  model: null,
  dragAddMethod: null,
  dragRemoveMethod: null
}

// 所有拖拽区域的缓存
const dragContainerCache = {

}

// 拖拽过程中的信息，只会有一个拖拽过程，在开始时设置值，在结束时清理值
let dragInfo = {

}

let dragImage = null

// 定义事件名
const EVENT_NAME_MOUSE_DOWN = 'mousedown'
const EVENT_NAME_MOUSE_MOVE = 'mousemove'
const EVENT_NAME_MOUSE_UP = 'mouseup'

const EVENT_NAME_DRAG_START = 'dragstart'
const EVENT_NAME_DRAG_OVER = 'dragover'
const EVENT_NAME_DRAG_ENTER = 'dragenter'
const EVENT_NAME_DRAG_END = 'dragend'
const EVENT_NAME_DROP = 'drop'

// 自定义的事件名
const CUSTOM_EVENT_NAME_DRAG_START = 'drag-start'
const CUSTOM_EVENT_NAME_DRAG_END = 'drag-end'
const CUSTOM_EVENT_NAME_DRAG_OVER = 'drag-over'
const CUSTOM_EVENT_NAME_DRAG_ENTER = 'drag-enter'
const CUSTOM_EVENT_NAME_DRAG_ADD = 'drag-add'
const CUSTOM_EVENT_NAME_DRAG_REMOVE = 'drag-remove'

const FIELD_DELAY_START = 'delayStart'
/**
 * 延迟拖拽时
 * 
 * @param {*} $event 
 */
const mouseDownListener = function ($event) {
  if (FIELD_DELAY_START in dragInfo) {
    // 避免冒泡导致无法选中最下级元素
    return
  }
  dragInfo.delayStart = $event.timeStamp
  this.addEventListener(EVENT_NAME_MOUSE_MOVE, mouseMoveListener)
  this.addEventListener(EVENT_NAME_MOUSE_UP, mouseUpListener)
  this.addEventListener(EVENT_NAME_DRAG_END, itemDragEntListener)
}

/**
 * 延迟触发拖拽事件时，使用的
 * @param {*} $event 
 */
const mouseMoveListener = function ($event) {
  let time = $event.timeStamp - dragInfo.delayStart
  // 判断按住时间是否够长
  if (time > this.$$drag.config.delay) {
    // 
    this.draggable = true
    this.addEventListener(EVENT_NAME_DRAG_START, dragStartListener)
    this.addEventListener(EVENT_NAME_DRAG_ENTER, itemDragEnterListener)
  } else {
    mouseUpListener.call(this)
  }
}

/**
 * 延迟拖拽时使用
 */
const mouseUpListener = function () {
  delete dragInfo.delayStart
  this.removeEventListener(EVENT_NAME_MOUSE_MOVE, mouseMoveListener)
  this.removeEventListener(EVENT_NAME_MOUSE_UP, mouseDownListener)
  this.draggable = false
  this.removeEventListener(EVENT_NAME_DRAG_START, dragStartListener)
  this.removeEventListener(EVENT_NAME_DRAG_ENTER, itemDragEnterListener)
  this.removeEventListener(EVENT_NAME_DRAG_END, itemDragEntListener)
}

/**
 * 拖拽结束时，清空延迟事件
 */
const itemDragEntListener = function () {
  mouseUpListener.call(this)
}

/**
 * 拖拽开始事件，注册拖拽相关信息
 * @param {*} $event 
 */
const dragStartListener = function ($event) {
  let srcContainer = dragContainerCache[this.$$drag.containerId]
  // 记录拖拽容器
  dragInfo.srcContainer = srcContainer
  // 记录起始区域ID
  dragInfo.srcContainerId = this.$$drag.containerId
  // 记录起始数据位置
  dragInfo.srcIndex = this.$$drag.index
  // 记录被拖拽的数据
  let data = this.$$drag.data
  if (this.$$drag.config.clone) {
    data = Object.assign({}, data || {})
  }
  // 复制数据
  dragInfo.data = data
  dragInfo.srcEl = this

  // 如果没有设置拖拽图片，则使用srcContainer作为拖拽图片
  if (dragImage) {
    dragImage.remove()
  }
  dragImage = document.createElement('div')
  dragImage.innerHTML = '拖拽测试'
  dragImage.style.position = 'absolute'
  dragImage.style.left = '-10000px'
  dragImage.style.top = '-10000px'
  dragImage.style.display = 'inline'
  dragImage.style.padding = '10px'
  document.body.appendChild(dragImage)
  $event.dataTransfer.setDragImage(dragImage, 0, 0)
  // 触发容器的拖拽事件
  dispatchEvent(dragInfo.srcContainer, CUSTOM_EVENT_NAME_DRAG_START)
  dispatchEvent(this, CUSTOM_EVENT_NAME_DRAG_START)
}

/**
 * 拖拽完成事件
 * @param {*} $event 
 */
const dragEndListener = function ($event) {
  if (dragInfo.targetContainer && !dragInfo.targetContainer.$$drag.config.drop) {
    return
  }
  // 阻止冒泡
  $event.stopPropagation()
  // 处理拖拽结果
  dragEndHandler()

  dispatchEvent(dragInfo.srcContainer, CUSTOM_EVENT_NAME_DRAG_END)

  // 清空拖拽过程中的数据
  dragInfo.dragEl && dragInfo.dragEl.remove()
  dragInfo = {}
}

/**
 * 处理拖拽结果
 * @param {*} $event 
 */
const dragEndHandler = function ($event) {
  let targetContainer = dragInfo.targetContainer
  let targetContainerId = dragInfo.targetContainerId
  // 获取起始容器
  let srcContainer = dragInfo.srcContainer
  let srcContainerConfig = srcContainer.$$drag.config
  let srcContainerId = dragInfo.srcContainerId
  let srcIndex = dragInfo.srcIndex
  // 通知起始节点移出
  if (!srcContainerConfig.clone) {
    // 原始容器采用克隆模式时，不删除老数据
    let srcModel = srcContainer.$$drag.model
    if (srcModel) {
      srcModel.splice(srcIndex, 1)
    }
    dispatchEvent(srcContainer, CUSTOM_EVENT_NAME_DRAG_REMOVE)
  }

  // 获取目标容器的信息
  let targetIndex = dragInfo.targetIndex
  // 获取容器的数据列
  let data = dragInfo.data
  let targetModel = dragInfo.targetContainer.$$drag.model
  if (targetModel) {
    if (srcContainerId === targetContainerId) {
      // 插入新数据
      if (targetIndex !== srcIndex || targetContainer.$$drag.config.clone) {
        targetModel.splice(targetIndex, 0, data)
      }
    } else {
      targetModel.splice(targetIndex, 0, data)
    }
  }

  // 触发自定义事件
  dispatchEvent(targetContainer, CUSTOM_EVENT_NAME_DRAG_ADD)

  console.log('drag-add', targetModel)
}

/**
 * 开启拖拽效果
 * @param {*} $event 
 */
const dragOverListener = function ($event) {
  $event.preventDefault()
  // 设置目标index
}

/**
 * 拖拽容器
 * @param {*} $event 
 */
const containerDragEnterListener = function ($event) {
  $event.stopPropagation()
  // 判断当前元素是否是起始元素的子组件
  if (dragInfo.srcEl.contains(this)) {
    // 记录目标容器
    dragInfo.targetContainer = dragInfo.srcContainer
    // 记录目标容器Id
    dragInfo.targetContainerId = dragInfo.srcContainerId
    // 获取容器数据的长度
    let index = dragInfo.srcEl.$$drag.index
    // 初始化目标位置
    dragInfo.targetIndex = index
  } else {
    // 记录目标容器
    dragInfo.targetContainer = dragContainerCache[this.$$drag.id]
    // 记录目标容器Id
    dragInfo.targetContainerId = this.$$drag.id
    // 获取容器数据的长度
    let data = this.$$drag.data || []
    let index = data.length
    // 初始化目标位置
    dragInfo.targetIndex = index
  }
}

/**
 * 拖拽元素的响应，后续改为over的响应，需要支持方向判断和位置元素标记
 * @param {*} $event 
 */
const itemDragEnterListener = function ($event) {
  $event.stopPropagation()
  // 判断当前元素是否是起始元素的子组件
  if (dragInfo.srcEl.contains(this)) {
    // 记录目标容器
    dragInfo.targetContainer = dragInfo.srcContainer
    // 记录目标容器Id
    dragInfo.targetContainerId = dragInfo.srcContainerId
    // 获取容器数据的长度
    let index = dragInfo.srcEl.$$drag.index
    // 初始化目标位置
    dragInfo.targetIndex = index
  } else {
    // 记录目标容器
    dragInfo.targetContainer = dragContainerCache[this.$$drag.containerId]
    // 记录目标容器Id
    dragInfo.targetContainerId = this.$$drag.containerId
    // 获取容器数据的长度
    let index = this.$$drag.index
    // 初始化目标位置
    dragInfo.targetIndex = index
  }
}

/**
 * 初始化拖拽容器
 * @param {*} el 容器dom对象
 * @param {*} binding
 * @param {*} vnode vue虚拟节点
 */
const initContainer = function (el, binding, vnode) {
  // 初始化drag
  el.$$drag = {
    id: getUID()
  }
  // 获取拖拽参数
  let config = Object.assign({}, defaultConfig, binding.value || {})
  // 计算延迟参数
  config.delay = +config.delay

  // 保存配置
  el.$$drag.config = config
  // 保存数据
  el.$$drag.model = config.model || null

  // 保存对vnode的引用
  el.$$drag.vnode = vnode

  // 保存缓存
  dragContainerCache[el.$$drag.id] = el

  if (config.draggable === false) {
    return
  }

  // 初始化
  el.addEventListener(EVENT_NAME_DRAG_OVER, dragOverListener)
  el.addEventListener(EVENT_NAME_DROP, dragEndListener)
  el.addEventListener(EVENT_NAME_DRAG_ENTER, containerDragEnterListener)
}

/**
 * 初始化容器下的子元素的拖拽功能
 * @param {*} el 容器的dom对象 
 */
const initItem = function (el) {
  // 初始化数据与节点的关联
  let id = el.$$drag.id
  let model = el.$$drag.model || []
  let config = el.$$drag.config

  if (config.drag === false) {
    return
  }

  // 异步执行，等子元素先渲染
  setTimeout(() => {
    // 获取所有子元素，并设置可拖拽
    let childNodes = el.childNodes
    if (config.selector) {
      childNodes = el.querySelectorAll(config.selector)
    }
    childNodes = childNodes || []
    childNodes.forEach((item, index) => {
      item.$$drag = {}
      item.$$drag.containerId = id
      item.$$drag.index = index
      item.$$drag.config = config
      item.$$drag.data = model[index]
      // 初始化拖拽元素的事件
      if (config.delay > 0) {
        item.addEventListener(EVENT_NAME_MOUSE_DOWN, mouseDownListener)
      } else {
        item.draggable = true
        item.addEventListener(EVENT_NAME_DRAG_START, dragStartListener)
        item.addEventListener(EVENT_NAME_DRAG_ENTER, itemDragEnterListener)
      }
    })
  })
}

/**
 * 触发自定义事件
 * @param {*} el 
 */
const dispatchEvent = function (el, eventName) {
  let event = new Event(eventName)
  event.$$dragInfo = dragInfo
  el.dispatchEvent(event)
}

let count = 0

const getUID = function () {
  return 'drag' + ++count;
}

export default {
  bind (el, binding, vnode) {
    initContainer(el, binding, vnode)
  },
  inserted (el, binding, vnode, oldVnode) {
    initItem(el)
  },
  update (el, binding, vnode, oldVnode) {
  },
  componentUpdated (el, binding, vnode, oldVnode) {
    initItem(el)
  },
  unbind (el) {
    if (!el.$$drag) {
      return
    }
    // 解绑时，销毁对象
    delete dragContainerCache[el.$$drag.id]
  }
}
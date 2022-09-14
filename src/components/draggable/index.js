import { Sortable, Swap, MultiDrag, AutoScroll } from 'sortablejs/modular/sortable.core.esm'
// import Sortable from 'sortablejs'
import { insertNodeAt, camelize, console, removeNode } from "./helper"

import { toggleClass, addNode, index } from '../../utils/packages/dom'

// 自定义插件
function PlainDragPlugin () {
  var lastActiveSortable
  var lastPlainDropContainer
  var lastPlainDropEl
  var lastPlainDropDirection
  var plainDropEl
  var plainDragImage
  var oldIndex = 0
  var newIndex = 0

  function createPlainDragImage (dragEl) {
    let el = document.createElement('div')
    // 数据调整
    el.innerHTML = dragEl.textContent

    el.className = 'sortable-drag-image'
    el.style.position = 'absolute'
    el.style.left = '-10000px'
    el.style.top = '-10000px'

    return el
  }

  function createPlainDropEl () {
    let el = document.createElement('div')
    el.className = 'sortable-drop-line'
    el.innerHTML = '<div class="sortable-drop-line__dot"></div><div class="sortable-drop-line__line"></div>'
    return el
  }

  function PlainDrag () {
    this.defaults = {
      plainOverClass: 'sortable-plain-highlight',
      // 用来替代默认的拖拽过程中的组件
      plainDragIamge: null,
      // 用来替代原本的组件，拖拽过程中插入到被插入位置
      plainDragEl: null,
      // 接管设置数据方法
      setData: function setData (dataTransfer, dragEl) {
        plainDragImage = this.plainDragIamge || createPlainDragImage(dragEl)
        document.body.appendChild(plainDragImage)
        dataTransfer.setDragImage(plainDragImage, 0, 0)
      }
    }
  }

  PlainDrag.prototype = {
    dragStart: function dragStart (_ref) {
      lastActiveSortable = _ref.sortable
      lastPlainDropContainer = _ref.parentEl
      lastPlainDropEl = _ref.dragEl
      plainDropEl = this.plainDragEl || createPlainDropEl()
    },
    dragOverValid: function dragOverValid (_ref2) {
      var completed = _ref2.completed,
        target = _ref2.target,
        onMove = _ref2.onMove,
        activeSortable = _ref2.activeSortable,
        changed = _ref2.changed,
        cancel = _ref2.cancel

      if (!activeSortable.options.plain) return

      var el = this.sortable.el,
        options = this.options

      if (!target) return

      var prevPlainDropContainer = lastPlainDropContainer
      if (target === el) {
        lastPlainDropContainer = target
      } else {
        lastPlainDropContainer = target.parentNode
      }
      if (lastPlainDropContainer !== prevPlainDropContainer || !lastPlainDropContainer.contains(plainDropEl)) {
        // 
        lastActiveSortable = activeSortable
        // 加入占位元素
        lastPlainDropContainer.appendChild(plainDropEl)

        if (lastPlainDropContainer.contains(_ref2.dragEl)) {
          // 以初始元素做定位
          // 判断方向
          let direction = getDirection(_ref2.dragEl, _ref2.originalEvent)
          if (lastPlainDropDirection !== direction) {
            lastPlainDropDirection = direction
            // 确定拖拽位置
            newIndex = insertIndex(lastPlainDropEl, lastActiveSortable.options.draggable, lastPlainDropDirection, [Sortable.clone, plainDropEl])
            // 设置方向样式
            plainDropEl.className = 'sortable-drop-line ' + 'sortable-drop-line--' + direction
            // 获取目标元素的样式，判断插入元素是否影响布局
            this.setPlainDropElStyle(getOffsetStyle(_ref2.dragEl, plainDropEl, _ref2.dragEl.parentNode, direction))
          }
        } else {
          // 清理样式
          this.cleanPlainDropElStyle()
        }
        // 如果当前容器中不包含上一个拖拽元素，则覆盖拖拽元素
        if (lastPlainDropContainer && lastPlainDropEl && !lastPlainDropContainer.contains(lastPlainDropEl)) {
          lastPlainDropEl = null
        }
      } else if (target !== el && target !== plainDropEl) {
        var prevPlainDropEl = lastPlainDropEl

        if (onMove(target) !== false) {
          toggleClass(target, options.plainOverClass, true)
          lastPlainDropEl = target
          // 判断方向
          let direction = getDirection(target, _ref2.originalEvent)
          if (lastPlainDropDirection !== direction) {
            lastPlainDropDirection = direction
            // 确定拖拽位置
            newIndex = insertIndex(lastPlainDropEl, lastActiveSortable.options.draggable, lastPlainDropDirection, [Sortable.clone, plainDropEl])
            // 设置方向样式
            plainDropEl.className = 'sortable-drop-line ' + 'sortable-drop-line--' + direction
            // 获取目标元素的样式，判断插入元素是否影响布局
            this.setPlainDropElStyle(getOffsetStyle(target, plainDropEl, target.parentNode, direction))
          }
        } else {
          lastPlainDropEl = null
          lastPlainDropDirection = null
        }

        if (prevPlainDropEl && prevPlainDropEl !== lastPlainDropEl && prevPlainDropEl) {
          toggleClass(prevPlainDropEl, options.plainOverClass, false)
        }
      }

      changed()
      completed(true)
      cancel()
    },
    drop: function drop (_ref3) {
      var activeSortable = _ref3.activeSortable,
        putSortable = _ref3.putSortable,
        dragEl = _ref3.dragEl
      var toSortable = putSortable || this.sortable
      var options = this.options
      lastPlainDropEl && toggleClass(lastPlainDropEl, options.plainOverClass, false)

      if (options.plain || putSortable && putSortable.options.plain) {
        if (dragEl !== lastPlainDropEl) {
          toSortable && toSortable.captureAnimationState()
          if (toSortable !== activeSortable) activeSortable && activeSortable.captureAnimationState()
          if (lastPlainDropEl) {
            addNode(dragEl, lastPlainDropEl, lastPlainDropDirection)
          } else if (lastPlainDropContainer) {
            lastPlainDropContainer.appendChild(dragEl)
          }
          toSortable.animateAll()
          if (toSortable !== activeSortable) activeSortable && activeSortable.animateAll()
        }
      }
    },
    showClone: function showClone (_ref) {
      // 阻止显示clone的元素
      _ref.cancel()
    },
    nulling: function nulling () {
      lastActiveSortable = null
      lastPlainDropContainer = null
      lastPlainDropEl = null
      lastPlainDropDirection = null
      plainDropEl && plainDropEl.remove()
      plainDropEl = null
      plainDragImage && plainDragImage.remove()
      plainDragImage = null
      newIndex = 0
    },
    cleanPlainDropElStyle () {
      plainDropEl.className = 'sortable-drop-line'
      plainDropEl.style.left = null
      plainDropEl.style.top = null
      let temp = plainDropEl.querySelector('.sortable-drop-line__line')
      temp.style.width = null
      temp.style.height = null
    },
    setPlainDropElStyle (style) {
      plainDropEl.style.left = style.left
      plainDropEl.style.top = style.top
      let temp = plainDropEl.querySelector('.sortable-drop-line__line')
      temp.style.width = style.width
      temp.style.height = style.height
    }
  }
  return Object.assign(PlainDrag, {
    pluginName: 'plain',
    eventProperties: function eventProperties () {
      return {
        lastActiveSortable: lastActiveSortable,
        lastPlainDropContainer: lastPlainDropContainer,
        lastPlainDropEl: lastPlainDropEl,
        lastPlainDropDirection: lastPlainDropDirection,
        newIndex: newIndex
      }
    }
  })
}

/**
 * 计算当前组件在容器中的顺序，根据
 * 
 * @param {*} target 
 * @param {*} selector
 * @param {*} direction 
 * @param {*} exceptions
 */
function insertIndex (target, selector, direction, ...exceptions) {
  let insertIndex = index(target, selector, exceptions)
  if (direction === 'bottom' || direction === 'right') {
    insertIndex++
  }
  if (insertIndex < 0) {
    insertIndex = 0
  }
  return insertIndex
}

/**
 * 获取鼠标在位置中的位置
 * 
 * @param {*} target 
 * @param {*} e 
 * @returns 
 */
function getDirection (target, e) {
  // 如何判断鼠标指向的位置，在目标的什么方位
  // step1，建立目标的坐标系，获取元素对应页面的坐标，左上角（x, y）, 宽高（w, h）中心点(xc, yc)的数据
  // step2，获取鼠标在目标元素中的坐标（xp, yp）
  // step3，则在穿过目标元素的（xp，xp)这一点的竖线条会与目标元素的对角线产生交点（x1, y1）（x2, y2）
  //        当 xc <= x + w / 2时，在元素的左边，
  //          则上交点为 （xp, 【（xp - x）* h / w + y】）, 下交点为（xp, 【y + h - （xp - x）* h / w】）
  //        当 xc > x + w/ 2时，在元素的右边
  //          则上交点为 （xp, 【y + h - （xp - x）* h / w】）, 下交点为（xp, 【（xp - x）* h / w + y】）
  // step4, 判断yp 与两个交点的位置关系判断实在上下还是左右，在左右时，根据xp和中心点的关系，得出在左还是在右
  // 建立虚拟坐标系，即目标元素的x，y为0, 0
  let x = 0, y = 0
  let w = target.offsetWidth, h = target.offsetHeight
  let xc = x + w / 2, yc = y + y / 2
  let xp = e.offsetX, yp = e.offsetY
  // 如果处于中心位置
  if (Math.abs(xp - xc) < 1) {
    return yp <= yc ? 'top' : 'bottom'
  }
  // 求上界下界
  let yj1 = (xp - x) * h / w + y
  let yj2 = y + h - (xp - x) * h / w
  let temp
  if (yj1 > yj2) {
    temp = yj1
    yj1 = yj2
    yj2 = temp
  }
  // 
  if (yp <= yj1) {
    return 'top'
  }
  if (yp > yj2) {
    return 'bottom'
  }
  // 
  return xp <= xc ? 'left' : 'right'
}

/**
 * 获取元素相对于容器的坐标
 * 
 * @param {*} target 元素
 * @param {*} container 容器
 * @returns 坐标
 */
function getOffsetPosition (target, container) {
  let x = target.offsetLeft
  let y = target.offsetTop
  if (target.offsetParent === container) {
    return { x, y }
  }
  return {
    x: x - container.offsetLeft,
    y: y - container.offsetTop
  }
}

function getOffsetStyle (target, locEl, container, direction) {
  let { x, y } = getOffsetPosition(target, container)
  // 
  let w = target.offsetWidth
  let h = target.offsetHeight
  let cW = container.clientWidth
  let cH = container.clientHeight

  let offset = Object.assign(
    getOffsetPosition(locEl, container),
    {
      left: (locEl.style.left ? +locEl.style.left.replace('px', '') : 0),
      top: (locEl.style.top ? +locEl.style.top.replace('px', '') : 0)
    }
  )

  let top = 0, left = 0
  let width = 0, height = 0

  if (direction === 'top') {
    top = offset.top + y - offset.y
    left = offset.left + x - offset.x
    width = w
    height = 2
  } else if (direction === 'bottom') {
    top = offset.top + y + h - offset.y
    left = offset.left + x - offset.x
    width = w
    height = 2
  } else if (direction === 'left') {
    top = offset.top + y - offset.y
    left = offset.left + x - offset.x
    width = 2
    height = h
  } else if (direction === 'right') {
    top = offset.top + y - offset.y
    left = offset.left + x + w - offset.x
    width = 2
    height = h
  }

  return {
    top: top + 'px',
    left: left + 'px',
    width: width + 'px',
    height: height + 'px'
  }
}

// 启用插件
Sortable.mount(new AutoScroll(), new Swap(), new MultiDrag(), new PlainDragPlugin())

function buildAttribute (object, propName, value) {
  if (value === undefined) {
    return object
  }
  object = object || {}
  object[propName] = value
  return object
}

function computeVmIndex (vnodes, element) {
  return vnodes.map(elt => elt.elm).indexOf(element)
}

function computeIndexes (slots, children, isTransition, footerOffset) {
  if (!slots) {
    return []
  }

  const elmFromNodes = slots.map(elt => elt.elm)
  const footerIndex = children.length - footerOffset
  const rawIndexes = [...children].map((elt, idx) =>
    idx >= footerIndex ? elmFromNodes.length : elmFromNodes.indexOf(elt)
  )
  return isTransition ? rawIndexes.filter(ind => ind !== -1) : rawIndexes
}

function emit (evtName, evtData) {
  this.$nextTick(() => this.$emit(evtName.toLowerCase(), evtData))
}

function delegateAndEmit (evtName) {
  return evtData => {
    if (this.realList !== null) {
      this["onDrag" + evtName](evtData)
    }
    emit.call(this, evtName, evtData)
  }
}

function isTransitionName (name) {
  return ["transition-group", "TransitionGroup"].includes(name)
}

function isTransition (slots) {
  if (!slots || slots.length !== 1) {
    return false
  }
  const [{ componentOptions }] = slots
  if (!componentOptions) {
    return false
  }
  return isTransitionName(componentOptions.tag)
}

function getSlot (slot, scopedSlot, key) {
  return slot[key] || (scopedSlot[key] ? scopedSlot[key]() : undefined)
}

function computeChildrenAndOffsets (children, slot, scopedSlot) {
  let headerOffset = 0
  let footerOffset = 0
  const header = getSlot(slot, scopedSlot, "header")
  if (header) {
    headerOffset = header.length
    children = children ? [...header, ...children] : [...header]
  }
  const footer = getSlot(slot, scopedSlot, "footer")
  if (footer) {
    footerOffset = footer.length
    children = children ? [...children, ...footer] : [...footer]
  }
  return { children, headerOffset, footerOffset }
}

function getComponentAttributes ($attrs, componentData) {
  let attributes = null
  const update = (name, value) => {
    attributes = buildAttribute(attributes, name, value)
  }
  const attrs = Object.keys($attrs)
    .filter(key => key === "id" || key.startsWith("data-"))
    .reduce((res, key) => {
      res[key] = $attrs[key]
      return res
    }, {})
  update("attrs", attrs)

  if (!componentData) {
    return attributes
  }
  const { on, props, attrs: componentDataAttrs } = componentData
  update("on", on)
  update("props", props)
  Object.assign(attributes.attrs, componentDataAttrs)
  return attributes
}

const eventsListened = ["Start", "Add", "Remove", "Update", "End"]
const eventsToEmit = ["Choose", "Unchoose", "Sort", "Filter", "Clone"]
const readonlyProperties = ["Move", ...eventsListened, ...eventsToEmit].map(
  evt => "on" + evt
)
var draggingElement = null

const props = {
  options: Object,
  list: {
    type: Array,
    required: false,
    default: null
  },
  value: {
    type: Array,
    required: false,
    default: null
  },
  noTransitionOnDrag: {
    type: Boolean,
    default: false
  },
  clone: {
    type: Function,
    default: original => {
      return original
    }
  },
  element: {
    type: String,
    default: "div"
  },
  tag: {
    type: String,
    default: null
  },
  move: {
    type: Function,
    default: null
  },
  componentData: {
    type: Object,
    required: false,
    default: null
  }
}

const draggableComponent = {
  name: "draggable",

  inheritAttrs: false,

  props,

  data () {
    return {
      transitionMode: false,
      noneFunctionalComponentMode: false
    }
  },

  render (h) {
    const slots = this.$slots.default
    this.transitionMode = isTransition(slots)
    const { children, headerOffset, footerOffset } = computeChildrenAndOffsets(
      slots,
      this.$slots,
      this.$scopedSlots
    )
    this.headerOffset = headerOffset
    this.footerOffset = footerOffset
    const attributes = getComponentAttributes(this.$attrs, this.componentData)
    return h(this.getTag(), attributes, children)
  },

  created () {
    if (this.list !== null && this.value !== null) {
      console.error(
        "Value and list props are mutually exclusive! Please set one or another."
      )
    }

    if (this.element !== "div") {
      console.warn(
        "Element props is deprecated please use tag props instead. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#element-props"
      )
    }

    if (this.options !== undefined) {
      console.warn(
        "Options props is deprecated, add sortable options directly as vue.draggable item, or use v-bind. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#options-props"
      )
    }
  },

  mounted () {
    this.noneFunctionalComponentMode =
      this.getTag().toLowerCase() !== this.$el.nodeName.toLowerCase() &&
      !this.getIsFunctional()
    if (this.noneFunctionalComponentMode && this.transitionMode) {
      throw new Error(
        `Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: ${this.getTag()}`
      )
    }
    const optionsAdded = {}
    eventsListened.forEach(elt => {
      optionsAdded["on" + elt] = delegateAndEmit.call(this, elt)
    })

    eventsToEmit.forEach(elt => {
      optionsAdded["on" + elt] = emit.bind(this, elt)
    })

    const attributes = Object.keys(this.$attrs).reduce((res, key) => {
      res[camelize(key)] = this.$attrs[key]
      return res
    }, {})

    const options = Object.assign({}, this.options, attributes, optionsAdded, {
      onMove: (evt, originalEvent) => {
        return this.onDragMove(evt, originalEvent)
      }
    })
    !("draggable" in options) && (options.draggable = ">*")
    this._sortable = new Sortable(this.rootContainer, options)
    this.computeIndexes()
  },

  beforeDestroy () {
    if (this._sortable !== undefined) this._sortable.destroy()
  },

  computed: {
    rootContainer () {
      return this.transitionMode ? this.$el.children[0] : this.$el
    },

    realList () {
      return this.list ? this.list : this.value
    }
  },

  watch: {
    options: {
      handler (newOptionValue) {
        this.updateOptions(newOptionValue)
      },
      deep: true
    },

    $attrs: {
      handler (newOptionValue) {
        this.updateOptions(newOptionValue)
      },
      deep: true
    },

    realList () {
      this.computeIndexes()
    }
  },

  methods: {
    getIsFunctional () {
      const { fnOptions } = this._vnode
      return fnOptions && fnOptions.functional
    },

    getTag () {
      return this.tag || this.element
    },

    updateOptions (newOptionValue) {
      for (var property in newOptionValue) {
        const value = camelize(property)
        if (readonlyProperties.indexOf(value) === -1) {
          this._sortable.option(value, newOptionValue[property])
        }
      }
    },

    getChildrenNodes () {
      if (this.noneFunctionalComponentMode) {
        return this.$children[0].$slots.default
      }
      const rawNodes = this.$slots.default
      return this.transitionMode ? rawNodes[0].child.$slots.default : rawNodes
    },

    computeIndexes () {
      this.$nextTick(() => {
        this.visibleIndexes = computeIndexes(
          this.getChildrenNodes(),
          this.rootContainer.children,
          this.transitionMode,
          this.footerOffset
        )
      })
    },

    getUnderlyingVm (htmlElt) {
      const index = computeVmIndex(this.getChildrenNodes() || [], htmlElt)
      if (index === -1) {
        //Edge case during move callback: related element might be
        //an element different from collection
        return null
      }
      const element = this.realList[index]
      return { index, element }
    },

    getUnderlyingPotencialDraggableComponent ({ __vue__: vue }) {
      if (
        !vue ||
        !vue.$options ||
        !isTransitionName(vue.$options._componentTag)
      ) {
        if (
          !("realList" in vue) &&
          vue.$children.length === 1 &&
          "realList" in vue.$children[0]
        )
          return vue.$children[0]

        return vue
      }
      return vue.$parent
    },

    emitChanges (evt) {
      this.$nextTick(() => {
        this.$emit("change", evt)
      })
    },

    alterList (onList) {
      if (this.list) {
        onList(this.list)
        return
      }
      const newList = [...this.value]
      onList(newList)
      this.$emit("input", newList)
    },

    spliceList () {
      const spliceList = list => list.splice(...arguments)
      this.alterList(spliceList)
    },

    updatePosition (oldIndex, newIndex) {
      const updatePosition = list =>
        list.splice(newIndex, 0, list.splice(oldIndex, 1)[0])
      this.alterList(updatePosition)
    },

    getRelatedContextFromMoveEvent ({ to, related }) {
      const component = this.getUnderlyingPotencialDraggableComponent(to)
      if (!component) {
        return { component }
      }
      const list = component.realList
      const context = { list, component }
      if (to !== related && list && component.getUnderlyingVm) {
        const destination = component.getUnderlyingVm(related)
        if (destination) {
          return Object.assign(destination, context)
        }
      }
      return context
    },

    getVmIndex (domIndex) {
      const indexes = this.visibleIndexes
      const numberIndexes = indexes.length
      return domIndex > numberIndexes - 1 ? numberIndexes : indexes[domIndex]
    },

    getComponent () {
      return this.$slots.default[0].componentInstance
    },

    resetTransitionData (index) {
      if (!this.noTransitionOnDrag || !this.transitionMode) {
        return
      }
      var nodes = this.getChildrenNodes()
      nodes[index].data = null
      const transitionContainer = this.getComponent()
      transitionContainer.children = []
      transitionContainer.kept = undefined
    },

    onDragStart (evt) {
      this.context = this.getUnderlyingVm(evt.item)
      evt.item._underlying_vm_ = this.clone(this.context.element)
      draggingElement = evt.item
    },

    onDragAdd (evt) {
      const element = evt.item._underlying_vm_
      if (element === undefined) {
        return
      }
      removeNode(evt.item)
      const newIndex = this.getVmIndex(evt.newIndex)
      this.spliceList(newIndex, 0, element)
      this.computeIndexes()
      const added = { element, newIndex }
      this.emitChanges({ added })
    },

    onDragRemove (evt) {
      insertNodeAt(this.rootContainer, evt.item, evt.oldIndex)
      if (evt.pullMode === "clone") {
        removeNode(evt.clone)
        return
      }
      const oldIndex = this.context.index
      this.spliceList(oldIndex, 1)
      const removed = { element: this.context.element, oldIndex }
      this.resetTransitionData(oldIndex)
      this.emitChanges({ removed })
    },

    onDragUpdate (evt) {
      removeNode(evt.item)
      insertNodeAt(evt.from, evt.item, evt.oldIndex)
      const oldIndex = this.context.index
      const newIndex = this.getVmIndex(evt.newIndex)
      this.updatePosition(oldIndex, newIndex)
      const moved = { element: this.context.element, oldIndex, newIndex }
      this.emitChanges({ moved })
    },

    updateProperty (evt, propertyName) {
      evt.hasOwnProperty(propertyName) &&
        (evt[propertyName] += this.headerOffset)
    },

    computeFutureIndex (relatedContext, evt) {
      if (!relatedContext.element) {
        return 0
      }
      const domChildren = [...evt.to.children].filter(
        el => el.style["display"] !== "none"
      )
      const currentDOMIndex = domChildren.indexOf(evt.related)
      const currentIndex = relatedContext.component.getVmIndex(currentDOMIndex)
      const draggedInList = domChildren.indexOf(draggingElement) !== -1
      return draggedInList || !evt.willInsertAfter
        ? currentIndex
        : currentIndex + 1
    },

    onDragMove (evt, originalEvent) {
      const onMove = this.move
      if (!onMove || !this.realList) {
        return true
      }

      const relatedContext = this.getRelatedContextFromMoveEvent(evt)
      const draggedContext = this.context
      const futureIndex = this.computeFutureIndex(relatedContext, evt)
      Object.assign(draggedContext, { futureIndex })
      const sendEvt = Object.assign({}, evt, {
        relatedContext,
        draggedContext
      })
      return onMove(sendEvt, originalEvent)
    },

    onDragEnd () {
      this.computeIndexes()
      draggingElement = null
    }
  }
}

if (typeof window !== "undefined" && "Vue" in window) {
  window.Vue.component("draggable", draggableComponent)
}

export default draggableComponent

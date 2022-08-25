<template>
  <div>
    <div>动态生成表单页面</div>
    <div v-if="component">
      <component :is="component"></component>
    </div>
    <div v-else>
      没有组件
    </div>
  </div>
</template>

<script>
import pageData from './page.json'

import _ from 'lodash'

import { isArray, isObject, isString } from '../../utils/packages/validator'

import { buildFunction, isFunctionStr } from '../../utils/packages/function'

import { getByPath } from '../../utils/packages/object'

import { isNativeTag } from '../../utils/packages/dom'

const attrExpRegExp = /^#\{(.+)\}$/

const parseAttr = function (ins, model, attrValue) {
  if (isString(attrValue) && attrExpRegExp.test(attrValue)) {
    return getByPath(model, attrExpRegExp.exec(attrValue)[1])
  }
  if (isObject(attrValue)) {
    return parseDefine(ins, model, attrValue)
  }
  if (isArray(attrValue)) {
    attrValue = attrValue.map(item => parseAttr(ins, model, item))
  }
  return attrValue
}

const parseDefine = function (ins, model, define) {
  // 解析每个属性
  for (let key in define) {
    // 不解析下级元素
    if (key === 'children') continue
    define[key] = parseAttr(ins, model, define[key])
  }
  return define
}

const createRender = function (ins, model, define, h) {
  // 解析属性
  define = parseDefine(ins, model, define)
  // 处理具体属性
  let { id, tag, text, field, attributes, children, events } = define

  let config = {
    props: attributes || {},
    on: events || {}
  }
  const { props, on } = config
  // 解析value
  if (field) {
    props.value = ins.$getByPath(model, field)
    on.input = function (newVal) {
      ins.$setByPath(model, field, newVal)
    }
  }
  // 解析ID
  if (id) {
    config.ref = id
  }
  // 生成下级元素
  let innerHtml = text
  // 解析下级属性
  if (children && children.length) {
    if (isNativeTag(tag)) {
      innerHtml = children.map(childDefine => createRender(ins, model, childDefine, h))
    } else {
      // 解析为插槽
      let scopedSlots = {}
      if (isArray(children)) {
        scopedSlots.default = createScopedSlot(ins, model, children, h)
      } else if (isObject(children)) {
        for (let key in children) {
          scopedSlots[key] = createScopedSlot(ins, model, children[key], h)
        }
      }
      config.scopedSlots = scopedSlots
    }
  }
  // 
  return h(
    tag || 'div',
    config,
    // 创建下级节点
    innerHtml
  )
}

const createScopedSlot = function (ins, model, children, h) {
  return function (props) {
    if (!children || !children.length) return []
    return children.map(childDefine => createRender(ins, model, childDefine, h))
  }
}

const parseMethods = function (methods) {
  methods = methods || {}
  for (let name in methods) {
    methods[name] = buildFunction(methods[name])
  }
  return methods
}

const parseEvents = function () {

}

const toType = function (typeStr) {
  if (typeStr === 'String') {
    return String
  } else if (typeStr === 'Function') {
    return Function
  } else if (typeStr === 'Array') {
    return Array
  } else if (typeStr === 'Object') {
    return Object
  } else if (typeStr === 'Boolean') {
    return Boolean
  } else if (typeStr === 'Number') {
    return Nubmer
  }
  return null
}

const parseProps = function (props) {
  props = props || {}
  let value
  for (let key in props) {
    value = props[key]
    if (isString(value)) {
      props[key] = toType(value)
    } else if (isArray(value)) {
      props[key] = value.map(item => toType(item))
    } else if (isObject(value)) {
      if (value.type) {
        if (isString(value.type)) {
          value.type = toType(value.type)
        } else if (isArray(value.type)) {
          value.type = value.type.map(item => toType(item))
        }
      }
      if (isFunctionStr(value.default)) {
        value.default = buildFunction(value.default)
      }
      if (isFunctionStr(value.validate)) {
        value.validate = buildFunction(value.validate)
      }
    }
  }
  return props
}

const createPageComponent = function (page) {
  let { model, define } = page
  // 页面的模型, 整个页面的数据包含在这个对象中
  model = model || {}
  define = define || {}
  // 处理方法等
  let { methods, meta, events, props, computed, watch, ...pageDefine } = define
  // 处理所有方法
  methods = parseMethods(methods)
  // 处理页面事件
  events = events || {}
  // 处理页面参数
  props = parseProps(props)
  // 处理计算属性
  computed = computed || {}
  // 计算监听属性
  watch = watch || {}
  // 单独处理生命周期事件
  let { created, mounted, updated, ...pageEvents } = events
  // 转为函数
  created = buildFunction(updated)
  mounted = buildFunction(mounted)
  updated = buildFunction(updated)
  // 保留除vue生命周期外的事件
  pageDefine.events = pageEvents
  // 创建组件
  return {
    render: function (h) {
      return createRender(this, this, pageDefine, h)
    },
    props,
    data () {
      return model
    },
    computed,
    watch,
    created,
    updated,
    mounted,
    methods
  }
}

export default {
  name: 'form-dynamic-view',

  data () {
    return {
      component: null
    }
  },

  mounted () {
    this.component = createPageComponent(pageData)
  }
}
</script>
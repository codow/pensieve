<template>
  <div>
    {{page}}
    <component :is="component"></component>
  </div>
</template>

<script>

import _ from 'lodash'

import { isArray, isFunction, isObject, isString } from '../../utils/packages/validator'

import { buildFunction, isFunctionStr } from '../../utils/packages/function'

import { getByPath } from '../../utils/packages/object'

import { isNativeTag } from '../../utils/packages/dom'

const attrExpRegExp = /^\$\{(.+)\}$/
const executeRegExp = /^#\{(.+)\}$/
// 提取变量的表达式
const variableRegExp = /(?<![\."'\w])([a-zA-Z_$][a-zA-Z0-9_$]*)/g

const createTemplate = function (define) {
  // 处理具体属性
  let { id, tag, text, field, vif, alt, vfor, key, _class, _style, attributes, events, children, directSlot } = define
  if (isString(text) && executeRegExp.test(text)) {
    text = `{{${executeRegExp.exec(text)[1]}}}`
  }
  if (!tag) {
    return text || ''
  }
  let attrTemplate = ''
  let appendHtml = ''
  if (vif) {
    if (executeRegExp.test(vif)) {
      vif = executeRegExp.exec(vif)[1]
    }
    attrTemplate += `v-if="${vif}"\n`
    if (alt) {
      if (executeRegExp.test(alt)) {
        alt = `{{${executeRegExp.exec(alt)[1]}}}`
      }
      appendHtml = `<template v-else>${alt}</template>\n`
    }
  }
  if (vfor) {
    if (executeRegExp.test(vfor)) {
      vfor = executeRegExp.exec(vfor)[1]
    }
    attrTemplate += `v-for="${vfor}"\n`
    if (key) {
      if (executeRegExp.test(key)) {
        key = executeRegExp.exec(key)[1]
      }
      attrTemplate += `:key="${key}"`
    }
  }
  if (id) {
    attrTemplate += `ref="${id}"\n`
  }
  if (_class) {
    if (isString(_class)) {
      attrTemplate += `class="${_class}"`
    } else {
      attrTemplate += `:class="${_class}"`
    }
  }
  if (_style) {
    if (isString(_style)) {
      attrTemplate += `style="${_style}"`
    } else {
      attrTemplate += `:style="${_style}"`
    }
  }
  if (field) {
    attrTemplate += `v-model="${field}"\n`
  }

  attrTemplate += createAttributesTemplate(attributes)

  attrTemplate += createEventsTemplate(events)

  let startTag = `<${tag} ${attrTemplate}>\n`
  let innerHtml = ''
  // 解析下级属性
  if (children) {
    innerHtml = ''
    if (isArray(children)) {
      innerHtml = children.map(childDefine => createTemplate(childDefine)).filter(item => !!item).join('')
    } else if (isObject(children)) {
      for (let scopeName in children) {
        let scopedSlot = children[scopeName]
        let scopedSlotChildren = []
        let scopedSlotParams = ''
        if (isObject(scopedSlot)) {
          scopedSlotChildren = scopedSlot.components || []
          scopedSlotParams = scopedSlot.params || ''
        } else if (isArray(scopedSlot)) {
          scopedSlotChildren = scopedSlot
        } else {
          continue
        }
        innerHtml += `<template #${scopeName}${scopedSlotParams ? '="' + scopedSlotParams + '"' : ''}>
        ${scopedSlotChildren.map(childDefine => createTemplate(childDefine)).filter(item => !!item).join('')}
        </template>`
      }
    }
  }
  innerHtml = innerHtml || text || ''
  let endTag = `</${tag}>\n`
  return `${startTag}${innerHtml}${endTag}${appendHtml}`
}

const createAttributesTemplate = function (attributes) {
  if (!attributes) return ''
  let _template = ''
  for (let key in attributes) {
    let value = attributes[key]
    if (isString(value)) {
      if (executeRegExp.test(value)) {
        value = executeRegExp.exec(value)[1]
        _template += `:${key}="${value}"\n`
      } else {
        _template += `${key}="${value}"\n`
      }
    } else {
      _template += `:${key}="${value}"\n`
    }
  }
  return _template
}

const createEventsTemplate = function (events) {
  if (!events) return ''
  let _template = ''
  for (let key in events) {
    let config = events[key]
    let method
    let params = ''
    let callParams = ''
    let inline = false
    if (isObject(config)) {
      inline = !!config.inline
      method = config.method
      params = config.params || ''
      callParams = config.callParams || params || ''
    } else {
      method = config
    }
    if (!isString(method)) {
      continue
    }
    if (executeRegExp.test(method)) {
      method = executeRegExp.exec(method)[1]
    }
    if (inline) {
      _template += `@${key}="(${params}) => ${method}(${callParams})"`
    } else {
      _template += `@${key}="${method}"\n`
    }
  }
  return _template
}

const parseMethods = function (methods) {
  methods = methods || {}
  for (let name in methods) {
    methods[name] = buildFunction(methods[name])
  }
  return methods
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
  if (!page) return null
  let { model, define } = page
  if (!define) return null
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
  let template = createTemplate(define)
  // console.log(template)
  // 创建组件
  return {
    template,
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
  name: 'form-designer-dynamic-template',

  props: {
    page: Object
  },

  data () {
    return {
      component: null
    }
  },

  watch: {
    page: {
      handler (newVal) {
        this.component = createPageComponent(newVal)
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    refresh () {
      this.component = createPageComponent(this.page)
    }
  }
}
</script>
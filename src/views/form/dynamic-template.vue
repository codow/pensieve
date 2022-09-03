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
import pageData from './page-template.json'

import _ from 'lodash'

import { isArray, isFunction, isObject, isString } from '../../utils/packages/validator'

import { buildFunction, isFunctionStr } from '../../utils/packages/function'

import { getByPath } from '../../utils/packages/object'

import { isNativeTag } from '../../utils/packages/dom'

const attrExpRegExp = /^\$\{(.+)\}$/
const executeRegExp = /^#\{(.+)\}$/
// 提取变量的表达式
const variableRegExp = /(?<![\."'\w])([a-zA-Z_$][a-zA-Z0-9_$]*)/g

const parseAttr = function (ins, model, pModel, attrValue) {
  if (isObject(attrValue)) {
    return parseDefine(ins, model, pModel, attrValue)
  }
  if (isArray(attrValue)) {
    attrValue = attrValue.map(item => parseAttr(ins, model, pModel, item))
  }
  return parseExpression(ins, model, pModel, attrValue)
}

const parseExpression = function (ins, model, pModel, config) {
  // 配置不存在则返回空函数
  if (!config) {
    return config
  }
  // 取条件
  if (!isString(config) || !executeRegExp.test(config)) {
    return config
  }
  config = executeRegExp.exec(config)[1]
  let paramNames = []
  let paramValues = []
  let exp = "var _vm = this\n"
  // 解析参数
  if (pModel) {
    for (let key in pModel) {
      paramNames.push(key)
      paramValues.push(pModel[key])
    }
  }
  // 解析表达式
  config = config.replaceAll(variableRegExp, (str, $1) => {
    if (paramNames.includes($1)) {
      return $1
    } else {
      return '_vm.' + $1
    }
  })
  exp += 'return (' + config + ')'
  // 执行表达式
  return (new Function(...paramNames, exp)).apply(ins, paramValues)
}

const parseDefine = function (ins, model, pModel, define) {
  // 解析每个属性
  for (let key in define) {
    // 不解析下级元素
    if (key === 'children') continue
    if (key === 'events') {
      // 解析事件
      define[key] = parseEvents(ins, model, pModel, define[key])
      continue
    }
    define[key] = parseAttr(ins, model, pModel, define[key])
  }
  return define
}

const createRender = function (ins, model, pModel, define, h) {
  // 取出children, 其他数据单独处理，避免
  let { children, directSlot, ...componentDefine } = define
  // 取出
  componentDefine = _.cloneDeep(componentDefine)
  // 解析属性
  componentDefine = parseDefine(ins, model, pModel, componentDefine)
  // 处理具体属性
  let { id, tag, text, field, inline, vif, alt, _class, _style, attributes, events } = componentDefine

  // 如果不显示
  if (vif !== undefined && !vif) {
    return alt ? alt : undefined
  }

  // 确定是否是内联组件，如果是内联的，则以上级组件的model作为全局范围，主要用在绑定字段
  let _model = inline && isObject(pModel) ? pModel : model

  let config = {
    props: attributes || {},
    on: events || {}
  }
  const { props, on } = config
  // 解析value
  if (field) {
    props.value = getByPath(_model, field)
    on.input = createInputProxyMethod(ins, _model, field)
  }
  // 解析ID
  if (id) {
    config.ref = id
  }
  // 样式解析
  if (_class) {
    config.class = _class
  }
  if (_style) {
    config.style = _style
  }
  // 生成下级元素
  let innerHtml = text
  // 解析下级属性
  if (children) {
    if (isNativeTag(tag)) {
      innerHtml = children.map(childDefine => createRender(ins, model, pModel, childDefine, h)).filter(item => !!item)
    } else if (directSlot) {
      innerHtml = []
      if (isArray(children)) {
        innerHtml = children.map(childDefine => createRender(ins, model, pModel, childDefine, h)).filter(item => !!item)
      } else if (isObject(children)) {
        for (let key in children) {
          innerHtml = innerHtml.concat(children.map(childDefine => createRender(ins, model, pModel, childDefine, h)).filter(item => !!item))
        }
      }
    } else {
      // 解析为插槽
      let scopedSlots = {}
      if (isArray(children)) {
        scopedSlots.default = createScopedSlot(ins, model, pModel, children, h)
      } else if (isObject(children)) {
        for (let key in children) {
          scopedSlots[key] = createScopedSlot(ins, model, pModel, children[key], h)
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

const createScopedSlot = function (ins, model, pModel, children, h) {
  return function (props) {
    if (!children || !children.length) return []
    return children.map(childDefine => createRender(ins, model, props, childDefine, h)).filter(item => !!item)
  }
}

const parseMethods = function (methods) {
  methods = methods || {}
  for (let name in methods) {
    methods[name] = buildFunction(methods[name])
  }
  return methods
}

const parseEvents = function (ins, model, pModel, events) {
  events = events || {}
  let eventConfig
  let inline, method
  for (let eventName in events) {
    eventConfig = events[eventName]
    if (isString(eventConfig)) {
      events[eventName] = parseAttr(ins, model, pModel, eventConfig)
    } else if (isObject(eventConfig)) {
      inline = !!eventConfig.inline
      method = eventConfig.method
      method = parseAttr(ins, model, pModel, method)
      if (inline) {
        method = createEventProxyMethod(ins, pModel, method)
      }
      events[eventName] = method
    }
  }
  return events
}

const _EMPTY_METHOD = function () { }

const createEventProxyMethod = function (ins, model, method) {
  method = method || _EMPTY_METHOD
  return function () {
    method.call(ins, ...arguments, model)
  }
}

const createInputProxyMethod = function (ins, model, field) {
  return function (newVal) {
    ins.$setByPath(model, field, newVal)
  }
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
  let template = createTemplate(define)
  console.log(template)
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
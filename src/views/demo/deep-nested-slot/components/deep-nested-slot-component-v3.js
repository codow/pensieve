const buildComponentRender = function (h, context) {
  let children = []
  let props = context.props
  // 创建名字
  children.push(h('div', props.name))
  // 创建子插槽
  if (props.slotName) {
    children.push(h('div', buildSlotRender(h, context)))
  }
  return children
}

const buildSlotRender = function (h, context) {
  let props = context.props
  let slots = [].concat(context.slots()[props.slotName] || [])
  // 已有下级
  if (slots.length) {
    return slots
  }
  // 判断是否有下级节点
  if (props.children) {
    // 如果有下级，则把数据传给下级
    props.children.forEach(item => {
      console.log(Object.assign({}, item))
      slots.push(h('deep-nested-slot-component', {
        props: Object.assign({}, item)
      }, context.children))
    })
  }
  return slots
}

export default {
  name: 'deep-nested-slot-component',
  functional: true,
  methods: {
  },
  render (h, context) {
    console.log(h, context, context.children, context.slots())
    let props = context.props
    return h(`div`, buildComponentRender(h, context))
  }
}
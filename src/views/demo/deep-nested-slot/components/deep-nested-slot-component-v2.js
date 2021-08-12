

export default {
  name: 'deep-nested-slot-component',
  props: ['name', 'slotName', 'children'],
  methods: {
    buildComponentRender (h) {
      let children = []
      // 创建名字
      children.push(h('div', this.name))
      // 创建子插槽
      if (this.slotName) {
        children.push(h('div', this.buildSlotRender(h)))
      }
      return children
    },

    buildSlotRender (h) {
      let slots = [].concat(this.$scopedSlots[this.slotName] ? this.$scopedSlots[this.slotName]() : [])
      // 已有下级
      if (slots.length) {
        return slots
      }
      // 判断是否有下级节点
      if (this.children) {
        // 如果有下级，则把数据传给下级
        this.children.forEach(item => {
          slots.push(h('deep-nested-slot-component', {
            props: Object.assign({}, item),
            scopedSlots: this.$scopedSlots
          }))
        })
      }
      return slots
    }
  },
  render (h) {
    console.log(this.name, this.$slots, this.$scopedSlots)
    return h(`div`, this.buildComponentRender(h))
  }
}
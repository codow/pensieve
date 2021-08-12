/**
 * 提供button-popover的基本功能
 * @author wangyb
 * @createTime 2021-08-03 11:24:08
 */
const DEFAULT_PROPS = {
  label: 'label',
  value: 'id',
  command: 'command',
  children: 'children',
  isLeaf: 'is_leaf',
  disabled: 'is_disabled'
}

export default {
  props: {
    disabled: Boolean,
    trigger: String,
    placement: String,
    popoverWidth: [String, Number],
    popoverClass: [String, Object, Array],
    popoverStyle: [String, Object],
    popperClass: String,
    title: String,
    transition: String,
    visibleArrow: { type: Boolean, default: true },
    popperOptions: Object,
    content: String,
    offset: Number,
    openDelay: Number,
    closeDelay: Number,
    tabindex: Number,
    size: String,
    type: String,
    icon: String,
    plain: Boolean,
    round: Boolean,
    circle: Boolean,
    loading: Boolean,
    autofocus: Boolean,
    nativeType: String,
    props: Object,
    buttonClass: [String, Object, Array],
    buttonStyle: [String, Object]
  },
  computed: {
    config () {
      return Object.assign({}, DEFAULT_PROPS, this.props || {})
    },
    finalPopperClass () {
      let popperClass = this.popperClass || ''
      popperClass += ' button-popover'
      return popperClass
    }
  }
}

/**
 * 列对象
 * @author wangyubo
 * @createTime 2021-01-06 15:34:11
 */

const DEFAULT_OPTIONS = {
  uid: null,
  width: null,
  class: null,
  style: null
}

const Col = function (options) {
  let config = Object.assign({}, DEFAULT_OPTIONS, options || {})
  // 设置值到
  Object.assign(this, config)
  this.options = options
}

export default Col

/**
 * 单元格对象
 * @author wangyubo
 * @createTime 2020-11-06 11:03:19
 */

const DEFAULT_OPTIONS = {
  uid: null,
  colSpan: 1,
  rowSpan: 1,
  // Cell内容与编辑
  editable: 0,
  text: null,
  // 是否被合并，被合并的单元格不创建
  merged: 0,
  // Cell的选中状态
  selectedAll: 0,
  selected: 0,
  selectedOriginally: 0,
  selectedAreaTopSide: 0,
  selectedAreaBottomSide: 0,
  selectedAreaLeftSide: 0,
  selectedAreaRightSide: 0,
  // 子组件
  children: null
}

const DATA_FIELD = ['text', 'colSpan', 'rowSpan', 'width', 'height', 'class', 'style', 'merged', 'children']

const Cell = function (options) {
  let config = Object.assign({}, DEFAULT_OPTIONS, options || {})
  // 设置值到
  Object.assign(this, config)
  this.options = options
  // 初始化下级元素
  if (!this.children) {
    this.children = []
  }
}

/**
 * cell的持久化方法
 */
Cell.prototype.toObject = function () {
  let obj = {}
  DATA_FIELD.forEach(field => {
    if (this[field] && this[field] !== DEFAULT_OPTIONS[field]) {
      obj[field] = this[field]
    }
  })
  // 对子元素特殊处理
  if (obj.children && obj.children.length === 0) {
    delete obj.children
  }
  return obj
}

Cell.prototype.toJSON = function () {
  return JSON.stringify(this.toObject())
}

export default Cell
/**
 * table对象，存储table的行列单元格等数据，并提供检索、计算等方法
 * @author wangyubo
 * @createTime 2020-11-10 11:30:55
 */

const Table = function (options) {
  options = Object.assign({}, options || {})
  // 设置表格的行列数
  this.row = options.row
  this.col = options.col
  // 设置特定行
  this.rows = []
  // 设置特定列
  this.cols = []
  // 设置特定单元格
  this.cells = []
  // 设置选中区域
  this.selectedArea = {
    x: -1,
    y: -1,
    w: -1,
    h: -1
  }
  // 记录原始选中节点
  this.originallySelectedCell = null
  // 记录区域选中时的当前节点
  this.currentSelectedCell = null
}

export default Table
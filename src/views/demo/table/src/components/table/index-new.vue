<template>
  <!-- 自动生成行列 -->
  <table class="table-layout"
         ref="table"
         border
         @mousedown="handleTableMouseDown($event)"
         @mouseup="handleTableMouseUp"
         @drag-start="handleDragStart">
    <!-- 生成 -->
    <col v-for="(col, colIndex) of colModels"
         :key="colIndex"
         :width="col.width"
         :style="col.style">
    <!-- 生成行列 -->
    <template v-for="(row, rowIndex) of cellModels">
      <!-- 列头 -->
      <TableRow v-if="rowIndex === 0"
                :key="rowModels[rowIndex].uid"
                :model="rowModels[rowIndex]"
                :row-index="rowIndex">
        <template v-for="(cell, colIndex) of row">
          <table-col-cell v-if="colIndex !== 0"
                          :key="cell.uid"
                          :model="cell"
                          :row-index="rowIndex"
                          :col-index="colIndex"
                          class="column-header"
                          :class="{[`col-${colIndex}`]: true}"
                          @select-cell="handleColSelect"
                          @cont-select-cell="handleColContSelect"
                          @open-cell-menu="handleCellMenuOpen">
            <!-- 列头 -->
            {{calcColName(colIndex)}}
            <div class="resize-line"
                 :col="colIndex"
                 @mousedown="handleColResizeLineMousedown"></div>
          </table-col-cell>
          <table-col-cell v-else
                          :key="cell.uid"
                          :model="cell"
                          :row-index="rowIndex"
                          :col-index="colIndex"
                          class="column-header row-header"
                          @select-cell="handleAllCellSelect">
            <!-- 全选 -->
            all
          </table-col-cell>
        </template>
      </TableRow>
      <TableRow v-else
                :key="rowModels[rowIndex].uid"
                :model="rowModels[rowIndex]"
                class="cell-row"
                :row-index="rowIndex">
        <template v-for="(cell, colIndex) of row">
          <table-row-cell v-if="colIndex === 0"
                          :key="cell.uid"
                          :model="cell"
                          :row-index="rowIndex"
                          :col-index="colIndex"
                          class="row-header"
                          @select-cell="handleRowSelect"
                          @cont-select-cell="handleRowContSelect"
                          @open-cell-menu="handleCellMenuOpen">
            <!-- 行头 -->
            {{rowIndex}}
            <div class="resize-line"
                 :row="rowIndex"
                 @mousedown="handleRowResizeLineMousedown"></div>
          </table-row-cell>
          <table-cell v-else
                      :key="cell.uid"
                      :model="cell"
                      :row-index="rowIndex"
                      :col-index="colIndex"
                      v-draggable="{ selector: '.drag-item', delay: 100, model: cell.children }"
                      @select-cell="handleCellSelect"
                      @cont-select-cell="handleCellContSelect"
                      @open-cell-menu="handleCellMenuOpen"
                      @close-cell-menu="handleCellMenuClose"
                      @drag-start.native="handleDragStart">
            <component v-for="(item, index) of cell.children"
                       :key="index"
                       :is="item.value"
                       class="drag-item"></component>
          </table-cell>
        </template>
      </TableRow>
    </template>
    <!-- 选择框上边线 -->
    <div ref="topLine"
         class="select-box__line select-box__top-line"
         @contextmenu.prevent="handleSelectBoxMenuOpen"></div>
    <!-- 选择框右边线 -->
    <div ref="rightLine"
         class="select-box__line select-box__right-line"
         @contextmenu.prevent="handleSelectBoxMenuOpen"></div>
    <!-- 选择框下边线 -->
    <div ref="bottomLine"
         class="select-box__line select-box__bottom-line"
         @contextmenu.prevent="handleSelectBoxMenuOpen"></div>
    <!-- 选择框左边线 -->
    <div ref="leftLine"
         class="select-box__line select-box__left-line"
         @contextmenu.prevent="handleSelectBoxMenuOpen"></div>

    <!-- 选择框上边线 -->
    <div ref="resizeTopLine"
         class="select-box__line resize-box__line select-box__top-line"></div>
    <!-- 选择框右边线 -->
    <div ref="resizeRightLine"
         class="select-box__line resize-box__line select-box__right-line"></div>
    <!-- 选择框下边线 -->
    <div ref="resizeBottomLine"
         class="select-box__line resize-box__line select-box__bottom-line"></div>
    <!-- 选择框左边线 -->
    <div ref="resizeLeftLine"
         class="select-box__line resize-box__line select-box__left-line"></div>

    <div ref="resizeTips"
         class="resize-tips">
      <span role="lable"
            class="resize-tips__title"></span>
      <span role="value"
            class="resize-tips__value"></span>
    </div>

    <!-- 内置单元格菜单 -->
    <div role="cellMenu"
         ref="cellMenu"
         class="cell-menu"
         :style="{ width: cellMenuModel.width + 'px' }"
         @contextmenu.prevent>
      <div v-for="(menu, index) of cellMenuModel.menus"
           :key="index"
           class="cell-menu-item"
           :style="{ height: cellMenuModel.itemHeight + 'px' }"
           @click="menu.handler"
           @contextmenu.prevent>{{menu.label}}</div>
    </div>
  </table>
</template>

<style lang="less">
.select-box__line {
  position: absolute;
  background-color: rgb(33, 115, 70);
  box-sizing: border-box;
  display: none;

  &.resize-box__line {
    // background-color: rgb(153, 153, 153);
    background-color: rgb(0, 0, 0);
  }

  &.select-box__top-line {
    height: 2px;

    &.resize-box__line {
      height: 1px;
    }
  }

  &.select-box__right-line {
    width: 2px;

    &.resize-box__line {
      width: 1px;
    }
  }

  &.select-box__bottom-line {
    height: 2px;

    &.resize-box__line {
      height: 1px;
    }
  }

  &.select-box__left-line {
    width: 2px;

    &.resize-box__line {
      width: 1px;
    }
  }
}

.resize-tips {
  position: absolute;
  left: -1000px;
  top: -1000px;
  border-radius: 5px;
  box-shadow: 1px 1px 2px 1px rgb(200, 200, 200);
  background: #fff;
  font-size: 12px;
  padding: 5px 10px;

  .resize-tips__title {
  }

  .resize-tips__value {
    color: rgb(33, 115, 70);
  }
}

.table-layout {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  // border: 1px solid #e4e7ed;
  border: 1px solid rgb(153, 153, 153);
  // border-spacing: 0px;
  cursor: cell;

  position: relative;

  .cell-row {
    height: 50px;
  }

  td {
    box-sizing: border-box;
    padding: 4px 5px;

    // border-top: 1px solid rgb(153, 153, 153);
    // border-left: 1px solid rgb(153, 153, 153);
    // border-bottom: 0px;
    // border-right: 0px;
    border: 1px solid rgb(153, 153, 153);

    // &:hover {
    //   cursor: cell;
    // }

    &.selected {
      // background-color: rgba(0, 0, 0, 0.1);

      &.selected-original {
        background-color: inherit;
      }

      &.selected-area-top {
        border-top-width: 2px;
        border-top-color: rgb(33, 115, 70);
        border-top-style: solid;
      }

      &.selected-area-bottom {
        border-bottom-width: 2px;
        border-bottom-color: rgb(33, 115, 70);
        border-bottom-style: solid;
      }

      &.selected-area-left {
        border-left-width: 2px;
        border-left-color: rgb(33, 115, 70);
        border-left-style: solid;
      }

      &.selected-area-right {
        border-right-width: 2px;
        border-right-color: rgb(33, 115, 70);
        border-right-style: solid;
      }
    }

    &.column-header {
      text-align: center;
      height: 30px;
      font-size: 12px;
      border-color: rgb(153, 153, 153);
      background-color: rgb(230, 230, 230);
      border-top: 0px;
      overflow: visible;

      position: relative;

      .resize-line {
        position: absolute;
        top: 0px;
        right: -5px;
        width: 3px;
        height: 100%;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;

        &:hover {
          cursor: col-resize;
        }
      }

      &.selected {
        color: rgb(33, 115, 70);
        border-width: 1px;
        border-bottom-width: 2px;
        border-color: rgb(153, 153, 153);
        border-bottom-color: rgb(33, 115, 70);
        background-color: rgba(0, 0, 0, 0.2);
        border-bottom-style: solid;
      }

      &.selected-all {
        background-color: rgba(33, 115, 70, 0.2);
        color: inherit;
        border-width: 1px;
        border-color: inherit;
      }
    }

    &.row-header {
      text-align: center;
      width: 30px;
      padding: 0;
      font-size: 12px;
      border-color: rgb(153, 153, 153);
      background-color: rgb(230, 230, 230);
      border-left: 0px;
      overflow: visible;

      position: relative;

      .resize-line {
        position: absolute;
        bottom: -5px;
        left: 0px;
        height: 3px;
        width: 100%;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;

        &.col-resize-line {
          width: 3px;
          height: 100%;
          top: 0px;
          bottom: auto;
          left: auto;
          right: -5px;
          border-top: 0;
          border-bottom: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
        }

        &:hover {
          cursor: row-resize;
        }
      }

      &.selected {
        color: rgb(33, 115, 70);
        border-width: 1px;
        border-right-width: 2px;
        border-color: rgb(153, 153, 153);
        border-right-color: rgb(33, 115, 70);
        background-color: rgba(0, 0, 0, 0.2);
        border-right-style: solid;
      }

      &.selected-all {
        background-color: rgba(33, 115, 70, 0.2);
        color: inherit;
        border-width: 1px;
        border-color: inherit;
      }
    }
  }
}

.cell-menu {
  position: absolute;
  left: -1000px;
  top: -1000px;
  background-color: #fff;
  padding: 10px;
  border: 1px solid rgb(153, 153, 153);
  border-radius: 4px;
  width: 200px;
  display: none;

  box-sizing: border-box;

  .cell-menu-item {
    padding: 5px 10px;

    box-sizing: border-box;

    &:hover {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>

<script>
import { nameToNumber, numberToName } from '../../utils/common'
import TableCell from '../cell'
import TableRow from '../row'
import TableColCell from '../cell/col-header-cell'
import TableRowCell from '../cell/row-header-cell'

import Cell from '../../entity/cell'
import Row from '../../entity/row'
import Col from '../../entity/col'

import draggable from '../../directives/draggable'

let cellCount = 0
const getCellUID = function () {
  return 'cell' + (++cellCount)
}

let rowCount = 0
const getRowUID = function () {
  return 'row' + (++rowCount)
}

let colCount = 0
const getColUID = function () {
  return 'colCount' + (++colCount)
}

/**
 * 计算单元格有效区域
 */
const calcMaxArea = function (cellsArea, rows, cols) {
  if (!cellsArea) return cellsArea

  cellsArea.minRowIndex = +cellsArea.minRowIndex
  cellsArea.minRowIndex = cellsArea.minRowIndex > 0 ? cellsArea.minRowIndex : 1
  // 
  cellsArea.minColIndex = +cellsArea.minColIndex
  cellsArea.minColIndex = cellsArea.minColIndex > 0 ? cellsArea.minColIndex : 1

  cellsArea.maxRowIndex = +cellsArea.maxRowIndex
  cellsArea.maxRowIndex = cellsArea.maxRowIndex > 0 ? cellsArea.maxRowIndex : rows

  cellsArea.maxColIndex = +cellsArea.maxColIndex
  cellsArea.maxColIndex = cellsArea.maxColIndex > 0 ? cellsArea.maxColIndex : cols
}

export default {
  name: 'table-layout',

  components: {
    TableRow,
    TableCell,
    TableColCell,
    TableRowCell
  },

  directives: {
    draggable
  },

  provide () {
    return {
      tableCellMenu: this.cellMenu
    }
  },

  props: {
    rowNumber: {
      type: Number,
      default: 10
    },
    colNumber: {
      type: Number,
      default: 10
    }
  },

  data () {
    return {
      contSelectStat: false,

      selectedOriginalCell: {
        rowIndex: -1,
        colIndex: -1
      },

      selectedArea: {
        minRowIndex: -1,
        minColIndex: -1,
        maxRowIndex: -1,
        maxColIndex: -1
      },

      resizeModel: {
        type: 'row', // 改变大小的类型，row 行，col 列
        x: -1, // 拖拽起始x坐标
        y: -1, // 拖拽起始y坐标
        height: 0,
        width: 0,
        newHeight: null,
        newWidth: null
      },

      cellMenuModel: {
        instance: null,
        visible: false,
        width: 200,
        itemHeight: 30,
        menus: [] // menus配置
      },

      colHeaderMenus: [
        {
          label: '插入',
          handler: this.insertCol
        }, {
          label: '删除',
          handler: this.deleteCol
        }, {
          label: '合并',
          handler: this.mergeCells
        }, {
          label: '拆分',
          handler: this.splitCells
        }
      ],

      rowHeaderMenus: [
        {
          label: '插入',
          handler: this.insertRow
        }, {
          label: '删除',
          handler: this.deleteRow
        }, {
          label: '合并',
          handler: this.mergeCells
        }, {
          label: '拆分',
          handler: this.splitCells
        }
      ],

      cellMenus: [
        {
          label: '合并',
          handler: this.mergeCells
        }, {
          label: '拆分',
          handler: this.splitCells
        }
      ],

      cellModels: [],
      rowModels: [],
      colModels: []
    }
  },

  created () {
    this.init()
    // 初始化事件
    this.initEvent()
  },

  destroyed () {
    if (this.cellMenuModel.instance) {
      this.cellMenuModel.instance.remove()
    }
    // 销毁事件
    this.destroyEvent()
  },

  methods: {
    init () {
      // 统一初始化行列和单元格数据存储
      let rowL = this.rowNumber + 1
      let colL = this.colNumber + 1
      // 初始化单元格数据存储
      let cellModels = []
      for (let i = 0; i < rowL; i++) {
        cellModels[i] = []
        // 初始化行对象
        this.rowModels.push(new Row({
          uid: getRowUID()
        }))
        for (let j = 0; j < colL; j++) {
          // 初始化列对象
          if (j === 0) {
            this.colModels.push(new Col({
              uid: getColUID()
            }))
          }

          cellModels[i][j] = new Cell({
            uid: getCellUID()
          })
        }
      }
      this.cellModels = cellModels
    },

    initEvent () {
      window.addEventListener('resize', this.resizeListener)

      window.addEventListener('mouseup', this.mouseupListener)
    },

    destroyEvent () {
      window.removeEventListener('resize', this.resizeListener)

      window.removeEventListener('mouseup', this.mouseupListener)
    },


    resizeListener () {
      // 重新计算框选
      this.showSelectBox()
    },

    mouseupListener () {
      this.$refs.table.style.cursor = ''
      // 隐藏resize box
      this.hideResizeBox()
    },

    calcColName (colNumber) {
      return numberToName(colNumber)
    },

    calcColNumber (colName) {
      return nameToNumber(colName)
    },

    handleCellMenuOpen (cell, rowIndex, colIndex, $event) {
      $event.preventDefault()
      $event.stopPropagation()

      if (rowIndex === 0 && colIndex === 0) {
        return
      } else if (rowIndex === 0) {
        this.cellMenuModel.menus = this.colHeaderMenus
      } else if (colIndex === 0) {
        this.cellMenuModel.menus = this.rowHeaderMenus
      } else {
        this.cellMenuModel.menus = this.cellMenus
      }

      this.cellMenuModel.instance = this.$refs.cellMenu
      document.body.append(this.cellMenuModel.instance)

      let x = $event.pageX
      let y = $event.pageY
      let maxWidth = document.documentElement.clientWidth
      let maxHeight = document.documentElement.clientHeight + document.documentElement.scrollTop
      let width = this.cellMenuModel.width
      let itemHight = this.cellMenuModel.itemHeight
      let height = itemHight * this.cellMenuModel.menus.length + 20

      //
      if (maxWidth - 10 < x + width) {
        x = maxWidth - 10 - width
      }
      if (maxHeight - 10 < y + height) {
        y = maxHeight - 10 - height
      }

      this.cellMenuModel.instance.style.left = x + 'px'
      this.cellMenuModel.instance.style.top = y + 'px'
      this.cellMenuModel.instance.style.display = 'block'
    },

    handleSelectBoxMenuOpen ($event) {
      let rowIndex = this.selectedArea.minRowIndex
      let colIndex = this.selectedArea.minColIndex
      let cell = this.cellModels[rowIndex][colIndex]

      this.handleCellMenuOpen(cell, rowIndex, colIndex, $event)
    },

    handleCellMenuClose () {
      if (!this.cellMenuModel.instance) {
        this.cellMenuModel.instance = this.$refs.cellMenu
      }
      this.cellMenuModel.instance.style.display = 'none'
    },

    handleCellSelect (cell, rowIndex, colIndex, $event) {
      if (cell.editable) {
        return
      }
      // 当前单元格未选中时，就清理掉选中状态
      if ($event.button !== 2 || !cell.selected) {
        this.clearSelectedOriginalCell()
        this.clearSelectedArea()
        this.setSelectedCell(rowIndex, colIndex)
      }
    },

    handleCellContSelect (cell, rowIndex, colIndex, $event) {
      if (this.contSelectStat) {
        // 清理选中的文本
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty()

        this.setSelectedArea(this.selectedOriginalCell.rowIndex, this.selectedOriginalCell.colIndex, rowIndex, colIndex)

        this.setSelectedRows(this.selectedArea.minRowIndex, this.selectedArea.maxRowIndex)

        this.setSelectedCols(this.selectedArea.minColIndex, this.selectedArea.maxColIndex)
      }
    },

    handleTableMouseDown ($event) {
      this.contSelectStat = true
    },

    handleTableMouseUp () {
      this.contSelectStat = false
    },

    clearSelectedText () {
      window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    },

    handleAllCellSelect (cell, rowIndex, colIndex, $event) {
      this.clearSelectedOriginalCell()
      // 选中所有的
      this.setSelectedArea(1, 1, this.cellModels.length - 1, this.cellModels[0].length - 1)
    },

    handleColSelect (cell, rowIndex, colIndex, $event) {
      if ($event.button !== 2 || !cell.selected) {
        this.clearSelectedOriginalCell()
        let ignoreMergedCell = false
        // 如果本列已全部合并
        let firstCell = this.cellModels[1][colIndex]
        if (firstCell.merged) {
          let srcCellPosition = this.getMergedCellSrcPosition(1, colIndex)
          firstCell = this.cellModels[srcCellPosition.rowIndex][srcCellPosition.colIndex]
        }
        if (firstCell.rowSpan > 0) {
          ignoreMergedCell = firstCell.rowSpan !== this.cellModels.length - 1
        }
        // 选中当前列
        this.setSelectedArea(1, colIndex, this.cellModels.length - 1, colIndex, {
          ignoreMergedCell
        })
      }
    },

    handleColContSelect (cell, rowIndex, colIndex, $event) {
      if (this.contSelectStat) {
        this.clearSelectedText()
        // 原始节点
        let origColIndex = this.selectedOriginalCell.colIndex

        let ignoreMergedCell = false
        // 如果本列已全部合并
        let minColIndex, maxColIndex
        if (origColIndex < colIndex) {
          minColIndex = origColIndex
          maxColIndex = colIndex
        } else {
          minColIndex = colIndex
          maxColIndex = origColIndex
        }
        for (let i = minColIndex, l = maxColIndex + 1; i < l; i++) {
          let firstCell = this.cellModels[1][i]
          if (firstCell.merged) {
            let srcCellPosition = this.getMergedCellSrcPosition(1, i)
            firstCell = this.cellModels[srcCellPosition.rowIndex][srcCellPosition.colIndex]
          }
          if (firstCell.rowSpan > 0) {
            ignoreMergedCell = firstCell.rowSpan !== this.cellModels.length - 1
            break
          }
        }
        // 选中当前列
        this.setSelectedArea(1, minColIndex, this.cellModels.length - 1, maxColIndex, {
          ignoreMergedCell
        })
      }
    },

    handleRowSelect (cell, rowIndex, colIndex, $event) {
      if ($event.button !== 2 || !cell.selected) {
        this.clearSelectedOriginalCell()
        let ignoreMergedCell = false
        // 如果本行已全部合并
        let firstCell = this.cellModels[rowIndex][1]
        if (firstCell.merged) {
          let srcCellPosition = this.getMergedCellSrcPosition(rowIndex, 1)
          firstCell = this.cellModels[srcCellPosition.rowIndex][srcCellPosition.colIndex]
        }
        if (firstCell.colSpan > 0) {
          ignoreMergedCell = firstCell.colSpan !== this.cellModels[0].length - 1
        }
        // 选中当前行
        this.setSelectedArea(rowIndex, 1, rowIndex, this.cellModels[0].length - 1, {
          ignoreMergedCell
        })
      }
    },

    handleRowContSelect (cell, rowIndex, colIndex, $event) {
      if (this.contSelectStat) {
        this.clearSelectedText()
        // 原始节点
        let origRowIndex = this.selectedOriginalCell.rowIndex

        let ignoreMergedCell = false
        // 如果本行已全部合并
        let minRowIndex, maxRowIndex
        if (origRowIndex < rowIndex) {
          minRowIndex = origRowIndex
          maxRowIndex = rowIndex
        } else {
          minRowIndex = rowIndex
          maxRowIndex = origRowIndex
        }
        for (let i = minRowIndex, l = maxRowIndex + 1; i < l; i++) {
          let firstCell = this.cellModels[i][1]
          if (firstCell.merged) {
            let srcCellPosition = this.getMergedCellSrcPosition(i, 1)
            firstCell = this.cellModels[srcCellPosition.rowIndex][srcCellPosition.colIndex]
          }
          if (firstCell.colSpan > 0) {
            ignoreMergedCell = firstCell.colSpan !== this.cellModels[0].length - 1
            break
          }
        }
        // 选中当前行
        this.setSelectedArea(minRowIndex, 1, maxRowIndex, this.cellModels[0].length - 1, {
          ignoreMergedCell
        })
      }
    },

    handleDragStart () {
      this.contSelectStat = false
    },

    getCell (rowIndex, colIndex) {
      let row = this.cellModels[rowIndex]
      if (!row) {
        return null
      }
      return row[colIndex]
    },

    insertCol ($event) {
      // 隐藏菜单
      this.handleCellMenuClose()
      // 在选中区域前插入一列
      let insertColIndex = this.selectedArea.minColIndex
      // 清理选中区域
      this.clearSelectedArea()
      let rows = this.cellModels.length
      let cols = this.cellModels[0].length
      let tempCell, tempSrcCell, tempSrcPosition
      let srcCellCache = []
      let newCells = []
      let merged
      for (let i = 0, l = rows; i < l; i++) {
        merged = 0
        // 判断插入的列是否处于合并范围内
        if (i > 0 && insertColIndex < cols) {
          tempSrcCell = this.cellModels[i][insertColIndex]
          if (tempSrcCell.merged) {
            // 
            tempSrcPosition = this.getMergedCellSrcPosition(i, insertColIndex)
            tempSrcCell = this.cellModels[tempSrcPosition.rowIndex][tempSrcPosition.colIndex]
            // 判断当前单元格是否是原始合并
            if (insertColIndex !== tempSrcPosition.colIndex) {
              // 不是同一列时，设置状态为已合并
              merged = 1
            } else if (insertColIndex === tempSrcPosition.colIndex && i !== tempSrcPosition.rowIndex) {
              // 同一列不同行时，设置状态为不合并
              merged = 0
            }
            if (srcCellCache.indexOf(tempSrcCell) === -1 && insertColIndex !== tempSrcPosition.colIndex) {
              // 设置合并范围+1
              tempSrcCell.colSpan += 1
              srcCellCache.push(tempSrcCell)
            }
          }
        }
        tempCell = new Cell({
          uid: getCellUID(),
          merged: merged
        })
        newCells.push(tempCell)
      }
      for (let i = 0, l = rows; i < l; i++) {
        this.cellModels[i].splice(insertColIndex, 0, newCells[i])
      }
      // 插入列对象
      this.colModels.splice(insertColIndex, 0, new Col({
        uid: getColUID()
      }))
      // 选中插入的列
      this.$nextTick(() => {
        this.handleColSelect(this.cellModels[1][insertColIndex], 1, insertColIndex, $event)
      })
    },

    deleteCol ($event) {
      // 隐藏菜单
      this.handleCellMenuClose()

      let minColIndex = this.selectedArea.minColIndex
      let maxColIndex = this.selectedArea.maxColIndex
      let cols = maxColIndex - minColIndex + 1

      // 清理选中区域
      this.clearSelectedArea()

      let rows = this.cellModels.length
      let srcCellCache = []
      let deletedSrcCellCache = []
      let tempCell, tempSrcCell, tempSrcPosition, tempNextCell
      // 计算需要合并的列
      for (let i = 0, l = rows; i < l; i++) {
        // 依次确定需要删除的单元格是否有合并
        for (let m = minColIndex, n = maxColIndex + 1; m < n; m++) {
          tempCell = this.cellModels[i][m]
          // 如果是合并的单元格，则向后继承
          if (tempCell.merged) {
            tempSrcPosition = this.getMergedCellSrcPosition(i, m)
            if (!tempSrcPosition) {
              // 已被处理了
              continue
            }
            tempSrcCell = this.cellModels[tempSrcPosition.rowIndex][tempSrcPosition.colIndex]
            if (srcCellCache.indexOf(tempSrcCell) === -1 && deletedSrcCellCache.indexOf(tempSrcCell) === -1) {
              srcCellCache.push(tempSrcCell)
              // 未处理的单元格, 未删除的
              // 原始单元格列合并-1
              tempSrcCell.colSpan -= cols
            }
          } else if (tempCell.colSpan > 1 && deletedSrcCellCache.indexOf(tempCell) === -1) {
            // 合并单元格删除
            srcCellCache.push(tempCell)
            deletedSrcCellCache.push(tempCell)
            // 取右侧单元格，继承合并属性
            tempNextCell = this.cellModels[i][m + 1]
            tempNextCell.merged = 0
            tempNextCell.rowSpan = tempCell.rowSpan
            tempNextCell.colSpan = tempCell.colSpan - cols
          }
        }
      }
      // 删除
      for (let i = 0, l = rows; i < l; i++) {
        this.cellModels[i].splice(minColIndex, cols)
      }
      // 删除列对象
      this.colModels.splice(minColIndex, cols)
      // 删除到最后一列时，自动增加一列
      if (this.cellModels[0].length === 1) {
        this.selectedArea.minRowIndex = 1
        this.selectedArea.minColIndex = 1
        this.selectedArea.maxRowIndex = 1
        this.selectedArea.maxColIndex = 1
        this.insertCol($event)
        return
      }
      if (minColIndex > this.cellModels[0].length - 1) {
        minColIndex = this.cellModels[0].length - 1
      }
      // 选中插入的列
      this.$nextTick(() => {
        this.handleColSelect(this.cellModels[1][minColIndex], 1, minColIndex, $event)
      })
    },

    insertRow ($event) {
      // 隐藏菜单
      this.handleCellMenuClose()
      // 在选中区域前插入一行
      let insertRowIndex = this.selectedArea.minRowIndex
      // 清理选中区域
      this.clearSelectedArea()
      let rows = this.cellModels.length
      let cols = this.cellModels[0].length
      let row = []
      let tempCell, tempSrcCell, tempSrcPosition
      let srcCellCache = []
      let merged
      for (let i = 0, l = cols; i < l; i++) {
        merged = 0
        // 判断插入的列是否处于合并范围内
        if (i > 0 && insertRowIndex < rows) {
          tempSrcCell = this.cellModels[insertRowIndex][i]
          if (tempSrcCell.merged) {
            // 
            tempSrcPosition = this.getMergedCellSrcPosition(insertRowIndex, i)
            tempSrcCell = this.cellModels[tempSrcPosition.rowIndex][tempSrcPosition.colIndex]
            // 判断当前单元格是否是原始合并
            if (insertRowIndex !== tempSrcPosition.rowIndex) {
              // 不是同一行时，设置状态为已合并
              merged = 1
            } else if (insertRowIndex === tempSrcPosition.rowIndex && i !== tempSrcPosition.colSpan) {
              // 同一行不同行时，设置状态为不合并
              merged = 0
            }
            if (srcCellCache.indexOf(tempSrcCell) === -1 && insertRowIndex !== tempSrcPosition.rowIndex) {
              // 设置合并范围+1
              tempSrcCell.rowSpan += 1
              srcCellCache.push(tempSrcCell)
            }
          }
        }
        // 判断当前
        tempCell = new Cell({
          uid: getCellUID(),
          merged
        })
        row.push(tempCell)
      }
      this.cellModels.splice(insertRowIndex, 0, row)
      // 插入列对象
      this.rowModels.splice(insertRowIndex, 0, new Col({
        uid: getRowUID()
      }))
      // 选中插入的行
      this.$nextTick(() => {
        this.handleRowSelect(this.cellModels[insertRowIndex][1], insertRowIndex, 1, $event)
      })
    },

    deleteRow ($event) {
      // 隐藏菜单
      this.handleCellMenuClose()
      // 在选中区域前插入一行
      let minRowIndex = this.selectedArea.minRowIndex
      let maxRowIndex = this.selectedArea.maxRowIndex
      let rows = maxRowIndex - minRowIndex + 1
      let cols = this.cellModels[0].length

      // 清理选中区域
      this.clearSelectedArea()
      // 计算合并的情况
      let srcCellCache = []
      let deletedSrcCellCache = []
      let tempCell, tempSrcCell, tempSrcPosition, tempNextCell
      for (let i = minRowIndex, l = maxRowIndex; i <= l; i++) {
        for (let m = 0, n = cols; m < n; m++) {
          // 获取被删除的单元格
          tempCell = this.cellModels[i][m]
          if (tempCell.merged) {
            // 当前单元格是被合并的单元格时
            tempSrcPosition = this.getMergedCellSrcPosition(i, m)
            if (!tempSrcPosition) {
              // 已被处理
              continue
            }
            tempSrcCell = this.cellModels[tempSrcPosition.rowIndex][tempSrcPosition.colIndex]
            // 判断是否被处理过了
            if (srcCellCache.indexOf(tempSrcCell) === -1) {
              tempSrcCell.rowSpan -= rows
              // 缓存
              srcCellCache.push(tempSrcCell)
            }
          } else if (tempCell.rowSpan > 1 && deletedSrcCellCache.indexOf(tempCell) === -1) {
            // 当前单元格跨行时，且未删除时，找到下一行的单元格并继承给他
            tempNextCell = this.cellModels[i + 1][m]
            tempNextCell.merged = 0
            tempNextCell.colSpan = tempCell.colSpan
            tempNextCell.rowSpan = tempCell.rowSpan - rows
            // 缓存
            srcCellCache.push(tempCell)
            deletedSrcCellCache.push(tempCell)
          }
        }
      }

      this.cellModels.splice(minRowIndex, rows)

      // 删除行对象
      this.rowModels.splice(minRowIndex, rows)

      // 删除到最后一行时，自动增加一行
      if (this.cellModels.length === 1) {
        this.selectedArea.minRowIndex = 1
        this.selectedArea.minColIndex = 1
        this.selectedArea.maxRowIndex = 1
        this.selectedArea.maxColIndex = 1
        this.insertRow($event)
        return
      }

      if (minRowIndex > this.cellModels.length - 1) {
        minRowIndex = this.cellModels.length - 1
      }
      // 选中行
      this.$nextTick(() => {
        this.handleRowSelect(this.cellModels[minRowIndex][1], minRowIndex, 1, $event)
      })
    },

    mergeCells () {
      // 隐藏菜单
      this.handleCellMenuClose()
      // 判断是否可以合并，及是否选中了区域范围内的所有合并单元格
      let checkedAllMergedCells = this.checkSelectedAllMergedCells()
      if (!checkedAllMergedCells) {
        this.$message({
          message: '有未选中的合并单元格，无法执行合并操作',
          type: 'error'
        })
        return
      }
      // 获取选中区域
      let minRowIndex = this.selectedArea.minRowIndex
      let minColIndex = this.selectedArea.minColIndex
      let maxRowIndex = this.selectedArea.maxRowIndex
      let maxColIndex = this.selectedArea.maxColIndex
      if (minRowIndex === maxRowIndex && minColIndex === maxColIndex) {
        return
      }
      // todo 检查选中区域内的单元格是否有多个文本内容，如果有则提示合并时只会保留左上角单元格的值
      // 合并单元格到左上角
      let cell = this.cellModels[minRowIndex][minColIndex]
      cell.rowSpan = maxRowIndex - minRowIndex + 1
      cell.colSpan = maxColIndex - minColIndex + 1
      // 其余单元格设置为忽略
      let tempCell
      for (let i = minRowIndex, l = maxRowIndex; i <= l; i++) {
        for (let m = minColIndex, n = maxColIndex; m <= n; m++) {
          tempCell = this.cellModels[i][m]
          if (i !== minRowIndex || m !== minColIndex) {
            tempCell.merged = 1
            tempCell.colSpan = 1
            tempCell.rowSpan = 1
          }
        }
      }
      // 设置选中单元格
      this.setSelectedCell(minRowIndex, minColIndex)
    },

    splitCells () {
      this.handleCellMenuClose()
      // 判断是否可以拆分，及是否选中了区域范围内的所有合并单元格
      let checkedAllMergedCells = this.checkSelectedAllMergedCells()
      if (!checkedAllMergedCells) {
        this.$message({
          message: '有未选中的合并单元格，无法执行拆分操作',
          type: 'error'
        })
        return
      }
      // 获取这个范围内所有合并的单元格
      this.forEachCells(cell => {
        if (cell.colSpan > 1 || cell.rowSpan > 1 || cell.merged) {
          cell.merged = 0
          cell.colSpan = 1
          cell.rowSpan = 1
        }
      }, Object.assign({}, this.selectedArea))
      // 重新选中本区域
      this.setSelectedArea(this.selectedArea.minRowIndex, this.selectedArea.minColIndex, this.selectedArea.maxRowIndex, this.selectedArea.maxColIndex)
    },

    handleRowResizeLineMousedown ($event) {
      // 终止冒泡和默认事件
      $event.stopPropagation()
      $event.preventDefault()

      this.handleCellMenuClose()
      // 获取当前行列号
      let el = $event.target
      let rowIndex = +el.getAttribute('row')
      // 获取cell位置
      let cell = this.$refs.table.querySelector(`.cell-${rowIndex}-0`)
      let cellX = cell.offsetLeft
      let cellY = cell.offsetTop
      this.resizeModel.cellX = cellX
      this.resizeModel.cellY = cellY
      // 记录当前位置
      this.resizeModel.x = $event.pageX
      this.resizeModel.y = $event.pageY
      this.resizeModel.type = 'row'
      // 获取当前行高
      this.resizeModel.rowIndex = rowIndex
      let rowEl = this.$refs.table.querySelector(`.row-${rowIndex}`)
      this.resizeModel.height = rowEl.offsetHeight
      // 计算需要显示resizebox的区域
      let area = {
        minRowIndex: rowIndex,
        minColIndex: 1,
        maxRowIndex: rowIndex,
        maxColIndex: this.cellModels[0].length - 1
      }
      // 显示resize-box
      this.showResizeBox(area)

      // 显示resize-tips
      this.showResizeTips()

      this.$refs.table.style.cursor = 'row-resize'
      // 动态添加全局的拖动事件
      window.addEventListener('mousemove', this.resizeMouseMoveListener)
      window.addEventListener('mouseup', this.resizeMouseUpListener)
    },

    handleColResizeLineMousedown ($event) {
      // 终止冒泡和默认事件
      $event.stopPropagation()
      $event.preventDefault()

      this.handleCellMenuClose()
      // 获取当前行列号
      let el = $event.target
      let colIndex = +el.getAttribute('col')
      // 获取cell位置
      let cell = this.$refs.table.querySelector(`.cell-0-${colIndex}`)
      let cellX = cell.offsetLeft
      let cellY = cell.offsetTop
      this.resizeModel.cellX = cellX
      this.resizeModel.cellY = cellY
      // 记录当前位置
      this.resizeModel.x = $event.pageX
      this.resizeModel.y = $event.pageY
      this.resizeModel.type = 'col'
      // 获取当前行高
      this.resizeModel.colIndex = colIndex
      let rowEl = this.$refs.table.querySelector(`.col-${colIndex}`)
      this.resizeModel.width = rowEl.offsetWidth
      // 计算需要显示resizebox的区域
      let area = {
        minRowIndex: 1,
        minColIndex: colIndex,
        maxRowIndex: this.cellModels.length - 1,
        maxColIndex: colIndex
      }
      // 显示resize-box
      this.showResizeBox(area)

      // 显示resize-tips
      this.showResizeTips()

      this.$refs.table.style.cursor = 'col-resize'
      // 动态添加全局的拖动事件
      window.addEventListener('mousemove', this.resizeMouseMoveListener)
      window.addEventListener('mouseup', this.resizeMouseUpListener)
    },

    resizeMouseMoveListener ($event) {
      if (this.resizeModel.type === 'row') {
        // 获取当前位置
        let y = $event.pageY
        let offsetY = y - this.resizeModel.y
        let height = this.resizeModel.height + offsetY
        this.resizeModel.newHeight = height > 0 ? height : 0
        let borderWidth = 0
        // 设置边框样式
        this.$refs.resizeRightLine.style.height = Math.abs(height) + borderWidth * 2 + 'px'
        this.$refs.resizeBottomLine.style.top = Number.parseFloat(this.$refs.resizeTopLine.style.top) + height + 'px'
        this.$refs.resizeLeftLine.style.height = Math.abs(height) + borderWidth * 2 + 'px'
        if (height < 0) {
          this.$refs.resizeLeftLine.style.top = Number.parseFloat(this.$refs.resizeTopLine.style.top) + height + 'px'
          this.$refs.resizeRightLine.style.top = Number.parseFloat(this.$refs.resizeTopLine.style.top) + height + 'px'
        } else {
          this.$refs.resizeLeftLine.style.top = this.$refs.resizeTopLine.style.top
          this.$refs.resizeRightLine.style.top = this.$refs.resizeTopLine.style.top
        }
        this.$refs.resizeTips.querySelector('.resize-tips__value').innerHTML = this.resizeModel.newHeight + '像素'
      } else {
        // 获取当前位置
        let x = $event.pageX
        let offsetX = x - this.resizeModel.x
        let width = this.resizeModel.width + offsetX
        this.resizeModel.newWidth = width > 0 ? width : 0
        let borderWidth = 0
        // 设置边框样式
        this.$refs.resizeTopLine.style.width = Math.abs(width) + borderWidth * 2 + 'px'
        this.$refs.resizeRightLine.style.left = Number.parseFloat(this.$refs.resizeLeftLine.style.left) + width + 'px'
        this.$refs.resizeBottomLine.style.width = Math.abs(width) + borderWidth * 2 + 'px'
        if (width < 0) {
          this.$refs.resizeTopLine.style.left = Number.parseFloat(this.$refs.resizeLeftLine.style.left) + width + 'px'
          this.$refs.resizeBottomLine.style.left = Number.parseFloat(this.$refs.resizeLeftLine.style.left) + width + 'px'
        } else {
          this.$refs.resizeTopLine.style.left = this.$refs.resizeLeftLine.style.left
          this.$refs.resizeBottomLine.style.left = this.$refs.resizeLeftLine.style.left
        }
        this.$refs.resizeTips.querySelector('.resize-tips__value').innerHTML = this.resizeModel.newWidth + '像素'
      }
    },

    resizeMouseUpListener ($event) {
      // 隐藏resizebox
      this.hideResizeBox()

      this.$refs.table.style.cursor = ''
      // 清理事件
      window.removeEventListener('mousemove', this.resizeMouseMoveListener)
      window.removeEventListener('mouseup', this.resizeMouseUpListener)
      // 改变行列大小
      if (this.resizeModel.type === 'row' && this.resizeModel.newHeight !== null && this.resizeModel.newHeight !== undefined && this.resizeModel.newHeight >= 0) {
        let height = this.resizeModel.newHeight
        // 设置行样式
        let row = this.rowModels[this.resizeModel.rowIndex]
        if (!row.style) {
          row.style = {}
        }
        this.$set(row.style, 'height', height + 'px')
      } else if (this.resizeModel.type === 'col' && this.resizeModel.newWidth !== null && this.resizeModel.newWidth !== undefined && this.resizeModel.newWidth >= 0) {
        let width = this.resizeModel.newWidth
        // 设置列样式
        let col = this.colModels[this.resizeModel.colIndex]
        if (!col.style) {
          col.style = {}
        }
        this.$set(col.style, 'width', width + 'px')
      }

      this.resizeModel.newWidth = null
      this.resizeModel.newHeight = null

      this.hideResizeTips()

      this.hideSelectBox()
      this.$nextTick(() => {
        this.showSelectBox()
      })
    },

    // api
    /**
     * 清理原始选中的单元格
     */
    clearSelectedOriginalCell () {
      this.selectedOriginalCell.rowIndex = -1
      this.selectedOriginalCell.colIndex = -1
    },

    /**
     * 清理选择区域
     */
    clearSelectedArea () {
      let tempCell
      let rows = this.cellModels.length
      let cols = this.cellModels[0].length
      if (this.selectedArea.minRowIndex > 0 && this.selectedArea.minColIndex > 0 && this.selectedArea.maxRowIndex > 0 && this.selectedArea.maxColIndex > 0) {
        // 清理老的选中区域
        for (let i = this.selectedArea.minRowIndex, l = this.selectedArea.maxRowIndex; i <= l && i < rows; i++) {
          this.cellModels[i][0].selected = 0
          this.cellModels[i][0].selectedAll = 0
          for (let m = this.selectedArea.minColIndex, n = this.selectedArea.maxColIndex; m <= n && m < cols; m++) {
            tempCell = this.cellModels[i][m]
            tempCell.selected = 0
            tempCell.editable = 0
            tempCell.selectedOriginal = 0
            tempCell.selectedAreaTopSide = 0
            tempCell.selectedAreaBottomSide = 0
            tempCell.selectedAreaLeftSide = 0
            tempCell.selectedAreaRightSide = 0
          }
        }
        for (let m = this.selectedArea.minColIndex, n = this.selectedArea.maxColIndex; m <= n && m < cols; m++) {
          this.cellModels[0][m].selected = 0
          this.cellModels[0][m].selectedAll = 0
        }
      }
      this.selectedArea.minColIndex = -1
      this.selectedArea.minRowIndex = -1
      this.selectedArea.maxColIndex = -1
      this.selectedArea.maxRowIndex = -1

      this.hideSelectBox()
    },

    /**
     * 设置选中的区域
     */
    setSelectedArea (origRowIndex, origColIndex, currRowIndex, currColIndex, options) {
      let config = Object.assign({
        ignoreMergedCell: false
      }, options || {})

      if (origRowIndex < 1 || origColIndex < 1 || currRowIndex < 1 || currColIndex < 1) {
        return
      }

      // 获取区域内所有的单元格，并计算选中区域
      let startRowIndex, startColIndex, endRowIndex, endColIndex
      if (origRowIndex > currRowIndex) {
        startRowIndex = currRowIndex
        endRowIndex = origRowIndex
      } else {
        startRowIndex = origRowIndex
        endRowIndex = currRowIndex
      }
      if (origColIndex > currColIndex) {
        startColIndex = currColIndex
        endColIndex = origColIndex
      } else {
        startColIndex = origColIndex
        endColIndex = currColIndex
      }
      let minRowIndex = Infinity
      let minColIndex = Infinity
      let maxRowIndex = -Infinity
      let maxColIndex = -Infinity
      // 遍历当前区域，并计算当前区域内的单元格
      let tempMinRowIndex, tempMinColIndex, tempMaxRowIndex, tempMaxColIndex, tempCell, tempPosition
      let rows = this.cellModels.length
      let cols = this.cellModels[0].length
      for (let i = startRowIndex, l = endRowIndex; i <= l & i < rows; i++) {
        for (let m = startColIndex, n = endColIndex; m <= n & m < cols; m++) {
          // 
          tempCell = this.cellModels[i][m]
          if (!config.ignoreMergedCell && tempCell.merged && (i > maxRowIndex || i < minRowIndex || m > maxColIndex || m < minColIndex)) {
            // 判断是否有跨行的单元格，如果有则继续重新调用选中区域
            tempPosition = this.getMergedCellSrcPosition(i, m)
            tempMinRowIndex = tempPosition.rowIndex
            tempMinColIndex = tempPosition.colIndex
            tempCell = this.cellModels[tempMinRowIndex][tempMinColIndex]
          } else {
            tempMinRowIndex = i
            tempMinColIndex = m
          }

          if (config.ignoreMergedCell) {
            tempMaxRowIndex = tempMinRowIndex
            tempMaxColIndex = tempMinColIndex
          } else {
            tempMaxRowIndex = tempMinRowIndex + tempCell.rowSpan - 1
            tempMaxColIndex = tempMinColIndex + tempCell.colSpan - 1
          }

          // 计算大小
          minRowIndex = minRowIndex > tempMinRowIndex ? tempMinRowIndex : minRowIndex
          minColIndex = minColIndex > tempMinColIndex ? tempMinColIndex : minColIndex

          maxRowIndex = maxRowIndex < tempMaxRowIndex ? tempMaxRowIndex : maxRowIndex
          maxColIndex = maxColIndex < tempMaxColIndex ? tempMaxColIndex : maxColIndex
        }
      }

      if (minRowIndex !== startRowIndex || minColIndex !== startColIndex || maxRowIndex !== endRowIndex || maxColIndex !== endColIndex) {
        this.setSelectedArea(minRowIndex, minColIndex, maxRowIndex, maxColIndex, options)
        return
      }

      // 清理老的选中区域
      this.clearSelectedArea()

      this.selectedArea.minColIndex = minColIndex
      this.selectedArea.minRowIndex = minRowIndex
      this.selectedArea.maxColIndex = maxColIndex
      this.selectedArea.maxRowIndex = maxRowIndex

      // 如果没有原始选中的单元格，则设置左上角单元格为原始的单元格
      if (this.selectedOriginalCell.rowIndex < 1 || this.selectedOriginalCell.colIndex < 1) {
        this.selectedOriginalCell.rowIndex = minRowIndex
        this.selectedOriginalCell.colIndex = minColIndex
      }
      tempCell = this.cellModels[this.selectedOriginalCell.rowIndex][this.selectedOriginalCell.colIndex]
      tempCell.selectedOriginal = 1
      let selectedAllRow = +((maxRowIndex - minRowIndex + 1) === (this.cellModels.length - 1))
      let selectedAllCol = +((maxColIndex - minColIndex + 1) === (this.cellModels[0].length - 1))
      // 设置新区域选中
      for (let i = minRowIndex, l = maxRowIndex; i <= l; i++) {
        // 设置行列选中
        this.cellModels[i][0].selected = 1
        this.cellModels[i][0].selectedAll = selectedAllCol
        for (let m = minColIndex, n = maxColIndex; m <= n; m++) {
          // 设置选中区域
          tempCell = this.cellModels[i][m]
          if (tempCell.merged) {
            continue
          }
          tempCell.selected = 1
          tempCell.selectedAreaTopSide = +(i === minRowIndex)
          tempCell.selectedAreaBottomSide = +(i + tempCell.rowSpan - 1 === maxRowIndex)
          tempCell.selectedAreaLeftSide = +(m === minColIndex)
          tempCell.selectedAreaRightSide = +(m + tempCell.colSpan - 1 === maxColIndex)
        }
      }
      for (let m = minColIndex, n = maxColIndex; m <= n; m++) {
        this.cellModels[0][m].selected = 1
        this.cellModels[0][m].selectedAll = selectedAllRow
      }

      // 显示选择框
      this.$nextTick(() => {
        this.showSelectBox()
      })
    },

    /**
     *  显示选择框
     */
    showSelectBox () {
      if (this.selectedArea.minRowIndex < 1 || this.selectedArea.minColIndex < 1 || this.selectedArea.minColIndex < 1 || this.selectedArea.maxColIndex < 1) {
        this.hideSelectBox()
        return
      }
      // 获取表格定位
      let tableEl = this.$refs.table

      // 获取选择范围内的单元格
      let startRowIndex = this.selectedArea.minRowIndex
      let endRowIndex = this.selectedArea.maxRowIndex
      let startColIndex = this.selectedArea.minColIndex
      let endColIndex = this.selectedArea.maxColIndex

      // 计算定位
      let left = -1000
      let top = -1000
      let width = 0
      let height = 0
      // 遍历单元格，计算选择范围大小
      let rows = []
      let cols = []
      let colHeaderCell, rowHeaderCell
      for (let i = startRowIndex, l = endRowIndex + 1; i < l; i++) {
        for (let m = startColIndex, n = endColIndex + 1; m < n; m++) {
          rowHeaderCell = tableEl.querySelector(`.cell-${i}-0`)
          colHeaderCell = tableEl.querySelector(`.cell-0-${m}`)
          // 如果定位未计算
          if (top === -1000 && i === startRowIndex) {
            // 如果上边距定位没有计算，并且当前单元格是第一列
            top = rowHeaderCell.offsetTop
          }
          if (left === -1000 && m === startColIndex) {
            // 如果左边距定位没有计算，并且当前单元格是第一列
            left = colHeaderCell.offsetLeft
          }
          // 计算宽高
          if (rows.indexOf(i) === -1) {
            // 未计算的行，则计算高度
            height += rowHeaderCell.offsetHeight
            rows.push(i)
          }
          if (cols.indexOf(m) === -1) {
            // 未计算的列，则计算宽度
            width += colHeaderCell.offsetWidth
            cols.push(m)
          }
        }

        let borderWidth = 2
        // 设置边框样式
        this.$refs.topLine.style.display = 'block'
        this.$refs.topLine.style.width = width + borderWidth + 'px'
        this.$refs.topLine.style.top = top - borderWidth + 'px'
        this.$refs.topLine.style.left = left - borderWidth + 'px'
        this.$refs.rightLine.style.display = 'block'
        this.$refs.rightLine.style.height = height + borderWidth + 'px'
        this.$refs.rightLine.style.top = top - borderWidth + 'px'
        this.$refs.rightLine.style.left = left - borderWidth + width + 'px'
        this.$refs.bottomLine.style.display = 'block'
        this.$refs.bottomLine.style.width = width + borderWidth + 'px'
        this.$refs.bottomLine.style.top = top + height - borderWidth + 'px'
        this.$refs.bottomLine.style.left = left - borderWidth + 'px'
        this.$refs.leftLine.style.display = 'block'
        this.$refs.leftLine.style.height = height + borderWidth + 'px'
        this.$refs.leftLine.style.top = top - borderWidth + 'px'
        this.$refs.leftLine.style.left = left - borderWidth + 'px'
      }
    },

    /**
     * 隐藏选择框
     */
    hideSelectBox () {
      this.$refs.topLine.style.display = 'none'
      this.$refs.rightLine.style.display = 'none'
      this.$refs.bottomLine.style.display = 'none'
      this.$refs.leftLine.style.display = 'none'
    },

    /**
     *  显示选择框
     */
    showResizeBox (area) {
      area = area || {
        minRowIndex: -1,
        minColIndex: -1,
        maxRowIndex: -1,
        maxColIndex: -1
      }

      if (area.minRowIndex < 1 || area.minColIndex < 1 || area.minColIndex < 1 || area.maxColIndex < 1) {
        this.hideResizeBox()
        return
      }
      // 获取表格定位
      let tableEl = this.$refs.table
      // 获取选择范围内的单元格
      let startRowIndex = area.minRowIndex
      let endRowIndex = area.maxRowIndex
      let startColIndex = area.minColIndex
      let endColIndex = area.maxColIndex

      // 计算定位
      let left = -1000
      let top = -1000
      let width = 0
      let height = 0

      // 遍历单元格，计算选择范围大小
      let rows = []
      let cols = []
      let colHeaderCell, rowHeaderCell
      for (let i = startRowIndex, l = endRowIndex + 1; i < l; i++) {
        for (let m = startColIndex, n = endColIndex + 1; m < n; m++) {
          rowHeaderCell = tableEl.querySelector(`.cell-${i}-0`)
          colHeaderCell = tableEl.querySelector(`.cell-0-${m}`)
          // 如果定位未计算
          if (top === -1000 && i === startRowIndex) {
            // 如果上边距定位没有计算，并且当前单元格是第一列
            top = rowHeaderCell.offsetTop
          }
          if (left === -1000 && m === startColIndex) {
            // 如果左边距定位没有计算，并且当前单元格是第一列
            left = colHeaderCell.offsetLeft
          }
          // 计算宽高
          if (rows.indexOf(i) === -1) {
            // 未计算的行，则计算高度
            height += rowHeaderCell.offsetHeight
            rows.push(i)
          }
          if (cols.indexOf(m) === -1) {
            // 未计算的列，则计算宽度
            width += colHeaderCell.offsetWidth
            cols.push(m)
          }
        }

        let borderWidth = 1
        // 设置边框样式
        this.$refs.resizeTopLine.style.display = 'block'
        this.$refs.resizeTopLine.style.width = width + borderWidth + 'px'
        this.$refs.resizeTopLine.style.top = top - borderWidth + 'px'
        this.$refs.resizeTopLine.style.left = left - borderWidth + 'px'
        this.$refs.resizeRightLine.style.display = 'block'
        this.$refs.resizeRightLine.style.height = height + borderWidth + 'px'
        this.$refs.resizeRightLine.style.top = top - borderWidth + 'px'
        this.$refs.resizeRightLine.style.left = left - borderWidth + width + 'px'
        this.$refs.resizeBottomLine.style.display = 'block'
        this.$refs.resizeBottomLine.style.width = width + borderWidth + 'px'
        this.$refs.resizeBottomLine.style.top = top + height - borderWidth + 'px'
        this.$refs.resizeBottomLine.style.left = left - borderWidth + 'px'
        this.$refs.resizeLeftLine.style.display = 'block'
        this.$refs.resizeLeftLine.style.height = height + borderWidth + 'px'
        this.$refs.resizeLeftLine.style.top = top - borderWidth + 'px'
        this.$refs.resizeLeftLine.style.left = left - borderWidth + 'px'
      }
    },

    /**
     * 隐藏大小改变框
     */
    hideResizeBox () {
      this.$refs.resizeTopLine.style.display = 'none'
      this.$refs.resizeRightLine.style.display = 'none'
      this.$refs.resizeBottomLine.style.display = 'none'
      this.$refs.resizeLeftLine.style.display = 'none'
    },

    showResizeTips () {
      // 获取定位
      let x = this.resizeModel.cellX + 10
      let y = this.resizeModel.cellY + this.resizeModel.height - 36
      let title = '高度'
      let value = this.resizeModel.height + '像素'
      if (this.resizeModel.type === 'col') {
        x = this.resizeModel.cellX + this.resizeModel.width - 100
        y = this.resizeModel.cellY + 10
        title = '宽度'
        value = this.resizeModel.width + '像素'
      }

      let width = 120

      let maxWidth = this.$refs.table.offsetWidth

      if (x + width > maxWidth - 10) {
        x = maxWidth - 10 - width
      } else if (x < 40) {
        x = 40
      }

      // 设置内容
      this.$refs.resizeTips.querySelector('.resize-tips__title').innerHTML = title
      this.$refs.resizeTips.querySelector('.resize-tips__value').innerHTML = value
      this.$refs.resizeTips.style.display = 'block'
      this.$refs.resizeTips.style.top = y + 'px'
      this.$refs.resizeTips.style.left = x + 'px'
    },

    hideResizeTips () {
      this.$refs.resizeTips.style.display = 'none'
    },

    /**
     * 设置选中的行
     */
    setSelectedRows (start, end) {
      if (start < 1 || end < 1) {
        return
      }
    },

    /**
     * 设置选中的列
     */
    setSelectedCols (start, end) {
      if (start < 1 || end < 1) {
        return
      }
    },

    /**
     * 设置选中的单元格
     */
    setSelectedCell (rowIndex, colIndex) {
      // 设置选中的区域
      this.setSelectedArea(rowIndex, colIndex, rowIndex, colIndex)
    },

    /**
     * 获取合并单元格的原始单元格
     */
    getMergedCellSrcPosition (rowIndex, colIndex) {
      // 确定查找范围
      let position = {}
      let tempCell
      let maxRowIndex, maxColIndex
      let l = 0, n = 0;
      for (let i = rowIndex; i > l; i--) {
        for (let m = colIndex; m > n; m--) {
          tempCell = this.cellModels[i][m]
          maxRowIndex = i + tempCell.rowSpan - 1
          maxColIndex = m + tempCell.colSpan - 1
          // 如果查找到没有被合并或者合并范围不包含需要查找的单元格时，则立即跳出，查找下一行
          if (tempCell.merged) {
            continue
          } else if (maxRowIndex < rowIndex) {
            // 设置行查询范围
            l = maxRowIndex
            break
          } else if (maxColIndex < colIndex) {
            // 设置列查询范围
            n = maxColIndex
            break
          } else {
            position.rowIndex = i
            position.colIndex = m
            return position
          }
        }
      }
      return null
    },

    /**
     * 获取合并单元格的原始单元格
     */
    getMergedCellSrcCell (rowIndex, colIndex) {
      // 获取
      let cell = null
      let position = this.getMergedCellSrcPosition(rowIndex, colIndex)
      if (position) {
        cell = this.cellModels[position.rowIndex][position.colIndex]
      }
      return cell
    },

    /**
     * 过滤所有满足条件的单元格
     */
    filterCells (func, cellsArea) {
      let cells = []
      if (!func) {
        return cells
      }
      calcMaxArea(cellsArea, this.cellModels.length - 1, this.cellModels[0].length)

      // 遍历单元格
      for (let i = cellsArea.minRowIndex, l = cellsArea.maxRowIndex; i <= l; i++) {
        for (let m = cellsArea.minColIndex, n = cellsArea.maxColIndex; m <= n; m++) {
          if (func(this.cellModels[i][m])) {
            cells.push(this.cellModels[i][m])
          }
        }
      }
      return cells
    },

    forEachCells (func, cellsArea) {
      calcMaxArea(cellsArea, this.rows, this.cols)
      // 遍历单元格
      for (let i = cellsArea.minRowIndex, l = cellsArea.maxRowIndex; i <= l; i++) {
        for (let m = cellsArea.minColIndex, n = cellsArea.maxColIndex; m <= n; m++) {
          func(this.cellModels[i][m])
        }
      }
    },

    /**
     * 判断当前单元格是否被选中
     */
    checkSelectedCell (rowIndex, colIndex) {
      let cell = this.cellModels[rowIndex][colIndex]
      if (cell.merged) {
        let position = this.getMergedCellSrcPosition(rowIndex, colIndex)
        if (!position) {
          return false
        }
        rowIndex = position.rowIndex
        colIndex = position.colIndex
        cell = this.getMergedCellSrcCell(rowIndex, colIndex)
      }

      return !!(cell && cell.selected && (rowIndex + cell.rowSpan - 1) <= this.selectedArea.maxRowIndex && (colIndex + cell.colSpan - 1) <= this.selectedArea.maxColIndex)
    },

    /**
     * 判断当前区域内是否包含被合并的单元格并被选中
     */
    checkSelectedAllMergedCells () {
      // 缓存
      for (let i = this.selectedArea.minRowIndex, l = this.selectedArea.maxRowIndex; i <= l; i++) {
        for (let m = this.selectedArea.minColIndex, n = this.selectedArea.maxColIndex; m <= n; m++) {
          if (!this.checkSelectedCell(i, m)) {
            return false
          }
        }
      }
      return true
    },

    toObject () {
      // 格式化表格数据
      let table = {
        rowNumber: this.cellModels.length - 1,
        colNumber: this.cellModels[0].length - 1,
      }
      let cells = []
      let row
      for (let i = 1, l = this.cellModels.length; i < l; i++) {
        row = []
        for (let m = 1, n = this.cellModels[0].length; m < n; m++) {
          row.push(this.cellModels[i][m].toObject())
        }
        cells.push(row)
      }
      table.cells = cells
      return table
    },

    toJSON () {
      return JSON.stringify(this.toObject())
    }
  }
}
</script>
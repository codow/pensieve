<template>
  <table class="table-layout"
         border
         @mousedown="handleTableMouseDown($event)"
         @mouseup="handleTableMouseUp">
    <tr v-for="y of layoutRows"
        :key="y">
      <template v-for="x of layoutCols">
        <td v-if="y === 0 && x !== 0"
            :key="x"
            class="column-header"
            :class="{selected: checkColumnSelected(x), 'selected-all': checkColumnSelectedAll(x)}"
            @mousedown="selectColumn(x, $event)"
            @mouseenter="contSelectColumn(x)"
            @mouseleave="clearSelectedText">
          <!-- 列头 -->
          {{calcColName(x)}}
        </td>
        <td v-else-if="y !== 0 && x === 0"
            :key="x"
            class="row-header"
            :class="{selected: checkRowSelected(y), 'selected-all': checkRowSelectedAll(y)}"
            @mousedown="selectRow(y, $event)"
            @mouseenter="contSelectRow(y)"
            @mouseleave="clearSelectedText">
          <!-- 行头 -->
          {{y}}
        </td>
        <td v-else-if="y === 0 && x === 0"
            :key="x"
            class="column-header row-header">
          <!-- 全选 -->
          all
        </td>

        <td v-else-if="!checkIgnoreCell(x, y)"
            :key="x"
            :class="calcCellClass(x, y)"
            :row="y"
            :col="x"
            :colspan="calcColSpan(x, y)"
            :rowspan="calcRowSpan(x, y)"
            @mousedown="selectCell(x, y, $event)"
            @mouseenter="contSelectCell(x, y)"
            @mouseleave="clearSelectedText"
            @contextmenu="showCellMenu(x, y, $event)">
          <draggable v-model="cellDatas[y][x]"
                     :group="{ name: 'tools'}"
                     style="height: 100%; width: 100%;">
            <component v-for="(item, index) of cellDatas[y][x]"
                       :key="index"
                       :is="item.value"></component>
          </draggable>
        </td>
      </template>
    </tr>
    <!-- 内置单元格菜单 -->
    <div role="cellMenu"
         class="cell-menu"
         v-show="cellMenu.visible"
         :style="{left: cellMenu.x+'px', top: cellMenu.y + 'px'}">
      <div class="cell-menu-item"
           @click="mergeCells">合并单元格</div>
      <div class="cell-menu-item"
           @click="splitCells">拆分单元格</div>
    </div>
  </table>
</template>

<style lang="less">
.table-layout {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  // border: 1px solid #e4e7ed;
  border: 1px solid rgb(153, 153, 153);

  td {
    height: 50px;
    box-sizing: border-box;
    padding: 4px 5px;

    &:hover {
      cursor: cell;
    }

    &.selected {
      background-color: rgba(0, 0, 0, 0.1);

      &.selected-original {
        background-color: inherit;
      }

      &.selected-area-top {
        border-top-width: 2px;
        border-top-color: rgb(33, 115, 70);
      }

      &.selected-area-bottom {
        border-bottom-width: 2px;
        border-bottom-color: rgb(33, 115, 70);
      }

      &.selected-area-left {
        border-left-width: 2px;
        border-left-color: rgb(33, 115, 70);
      }

      &.selected-area-right {
        border-right-width: 2px;
        border-right-color: rgb(33, 115, 70);
      }
    }

    &.column-header {
      text-align: center;
      height: 30px;
      font-size: 12px;
      border-color: rgb(153, 153, 153);
      background-color: rgb(230, 230, 230);

      &.selected {
        color: rgb(33, 115, 70);
        border-width: 1px;
        border-bottom-width: 2px;
        border-color: rgb(153, 153, 153);
        border-bottom-color: rgb(33, 115, 70);
        background-color: rgba(0, 0, 0, 0.2);
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

      &.selected {
        color: rgb(33, 115, 70);
        border-width: 1px;
        border-right-width: 2px;
        border-color: rgb(153, 153, 153);
        border-right-color: rgb(33, 115, 70);
        background-color: rgba(0, 0, 0, 0.2);
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
  background-color: #fff;
  padding: 10px;
  border: 1px solid rgb(153, 153, 153);
  border-radius: 4px;

  .cell-menu-item {
    padding: 5px 10px;

    &:hover {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>

<script>
import { nameToNumber, numberToName } from '../../utils/common'

export default {
  name: 'demo-table-layout',

  props: {
    rows: {
      type: Number,
      default: 20
    },
    cols: {
      type: Number,
      default: 10
    }
  },

  computed: {
    // layoutRows () {
    //   let l = this.rows + 1
    //   let rows = []
    //   for (let i = 0; i < l; i++) {
    //     rows.push(i)
    //   }
    //   return rows
    // },

    // layoutCols () {
    //   let l = this.cols + 1
    //   let cols = []
    //   for (let i = 0; i < l; i++) {
    //     cols.push(i)
    //   }
    //   return cols
    // }
  },

  data () {
    return {
      contSelectStat: false,

      selectedOriginalCell: {
        x: -1,
        y: -1
      },

      selectedStartCell: {
        x: -1,
        y: -1
      },

      selectedEndCell: {
        x: -1,
        y: -1
      },

      selectedArea: {
        minX: -1,
        maxX: -1,
        minY: -1,
        maxY: -1
      },

      cellMenu: {
        instance: null,
        visible: false,
        x: -1000,
        y: -1000
      },

      mergedCells: [],

      ignoreCells: {},

      layoutRows: [],
      layoutCols: [],
      cellDatas: []
    }
  },

  watch: {
    cellDatas: {
      handler (newVal) {
      },
      deep: true
    }
  },

  created () {
    this.init()
  },

  destroyed () {
    if (this.cellMenu.instance) {
      document.body.removeChild(this.cellMenu.instance)
    }
  },

  methods: {
    init () {
      // 统一初始化行列和单元格数据存储
      let rowL = this.rows + 1
      let rows = []
      for (let i = 0; i < rowL; i++) {
        rows.push(i)
      }
      this.layoutRows = rows
      let colL = this.cols + 1
      let cols = []
      for (let i = 0; i < colL; i++) {
        cols.push(i)
      }
      this.layoutCols = cols
      // 初始化单元格数据存储
      let cellDatas = []
      for (let i = 0; i < rowL; i++) {
        cellDatas[i] = []
        for (let j = 0; j < colL; j++) {
          cellDatas[i][j] = [{ value: 'el-input', label: '输入框' }]
        }
      }
      this.cellDatas = cellDatas
    },

    calcColName (colNumber) {
      return numberToName(colNumber)
    },

    calcColNumber (colName) {
      return nameToNumber(colName)
    },

    calcCellName (x, y) {
      return this.calcColName(x) + y
    },

    checkCellSelected (x, y) {
      return x >= this.selectedArea.minX && x <= this.selectedArea.maxX && y >= this.selectedArea.minY && y <= this.selectedArea.maxY
    },

    checkCellSelectedAreaTop (x, y) {
      return x >= this.selectedArea.minX && x <= this.selectedArea.maxX && y === this.selectedArea.minY
    },

    checkCellSelectedAreaBottom (x, y) {
      return x >= this.selectedArea.minX && x <= this.selectedArea.maxX && y === this.selectedArea.maxY
    },

    checkCellSelectedAreaLeft (x, y) {
      return x === this.selectedArea.minX && y >= this.selectedArea.minY && y <= this.selectedArea.maxY
    },

    checkCellSelectedAreaRight (x, y) {
      return x === this.selectedArea.maxX && y >= this.selectedArea.minY && y <= this.selectedArea.maxY
    },

    checkCellSelectedStart (x, y) {
      return x === this.selectedOriginalCell.x && y === this.selectedOriginalCell.y
    },

    calcCellClass (x, y) {
      let clazz = {}
      if (this.checkCellSelected(x, y)) {
        clazz['selected'] = true

        if (this.checkCellSelectedStart(x, y)) {
          clazz['selected-original'] = true
        }

        let endX = x, endY = y
        let mergedConfig = this.getMergedConfig(x, y)
        if (mergedConfig) {
          endX = mergedConfig.x + mergedConfig.w - 1
          endY = mergedConfig.y + mergedConfig.h - 1
        }

        if (y === this.selectedArea.minY) {
          clazz['selected-area-top'] = true
        }

        if (endY === this.selectedArea.maxY) {
          clazz['selected-area-bottom'] = true
        }

        if (x === this.selectedArea.minX) {
          clazz['selected-area-left'] = true
        }

        if (endX === this.selectedArea.maxX) {
          clazz['selected-area-right'] = true
        }
      }
      return clazz
    },

    setSelectedOriginalCell (x, y) {
      this.selectedOriginalCell.x = x
      this.selectedOriginalCell.y = y
    },

    setSelectedStartCell (x, y) {
      this.selectedStartCell.x = x
      this.selectedStartCell.y = y
    },

    setSelectedEndCell (x, y) {
      this.selectedEndCell.x = x
      this.selectedEndCell.y = y
    },

    showCellMenu (x, y, $event) {
      $event.preventDefault()
      if (!this.cellMenu.instance) {
        this.cellMenu.instance = this.$el.querySelector('[role="cellMenu"]')
        document.body.appendChild(this.cellMenu.instance)
      }
      this.cellMenu.x = event.pageX
      this.cellMenu.y = event.pageY
      this.cellMenu.visible = true
    },

    selectCell (x, y, $event) {
      if (!$event.srcElement || $event.srcElement.nodeName !== 'TD') {
        return
      }
      if ($event.button === 1 || !this.checkCellSelected(x, y)) {
        // 获取合并单元格配置
        let endX = x, endY = y
        let mergedConfig = this.getMergedConfig(x, y)
        if (mergedConfig) {
          endX = mergedConfig.x + mergedConfig.w - 1
          endY = mergedConfig.y + mergedConfig.h - 1
        }
        this.setSelectedOriginalCell(x, y)
        this.setSelectedStartCell(x, y)
        this.setSelectedEndCell(endX, endY)
        this.calcSelectedArea()
      }

      if ($event.button !== 2) {
        this.cellMenu.visible = false
      }
    },

    contSelectCell (x, y) {
      if (this.contSelectStat) {
        // 获取合并单元格配置
        let endX = x, endY = y
        let mergedConfig = this.getMergedConfig(x, y)
        if (mergedConfig) {
          endX = mergedConfig.x + mergedConfig.w - 1
          endY = mergedConfig.y + mergedConfig.h - 1
          if (!this.checkCellSelected(x, y)) {
            // 获取新的起点
            x = Math.min(x, this.selectedOriginalCell.x)
            y = Math.min(y, this.selectedOriginalCell.y)
            endX = Math.max(endX, this.selectedOriginalCell.x)
            endY = Math.max(endY, this.selectedOriginalCell.y)
            this.setSelectedStartCell(x, y)
          }
        }
        this.setSelectedEndCell(endX, endY)
        this.calcSelectedArea()
      }
    },

    calcSelectedArea () {
      let minX = this.selectedStartCell.x
      let maxX = this.selectedEndCell.x

      // 交换大小
      if (minX > maxX) {
        minX = minX ^ maxX
        maxX = minX ^ maxX
        minX = minX ^ maxX
      }

      let minY = this.selectedStartCell.y
      let maxY = this.selectedEndCell.y

      // 交换大小
      if (minY > maxY) {
        minY = minY ^ maxY
        maxY = minY ^ maxY
        minY = minY ^ maxY
      }

      this.selectedArea.minX = minX
      this.selectedArea.maxX = maxX
      this.selectedArea.minY = minY
      this.selectedArea.maxY = maxY
    },

    handleTableMouseDown ($event) {
      // if (!$event.srcElement || $event.srcElement.nodeName !== 'TD') {
      //   return
      // }
      this.contSelectStat = true
    },

    handleTableMouseUp () {
      this.contSelectStat = false
    },

    clearSelectedText () {
      window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty()
    },

    selectColumn (x, $event) {
      this.setSelectedStartCell(x, 1)
      this.setSelectedEndCell(x, Infinity)
      this.calcSelectedArea()
    },

    contSelectColumn (x) {
      if (this.contSelectStat) {
        this.setSelectedEndCell(x, Infinity)
        this.calcSelectedArea()
      }
    },

    selectRow (y, $event) {
      this.setSelectedStartCell(1, y)
      this.setSelectedEndCell(Infinity, y)
      this.calcSelectedArea()
    },

    contSelectRow (y) {
      if (this.contSelectStat) {
        this.setSelectedEndCell(Infinity, y)
        this.calcSelectedArea()
      }
    },

    checkColumnSelected (x) {
      return x >= this.selectedArea.minX && x <= this.selectedArea.maxX
    },

    checkColumnSelectedAll (x) {
      return this.checkColumnSelected(x) && this.selectedArea.maxY === Infinity
    },

    checkRowSelected (y) {
      return y >= this.selectedArea.minY && y <= this.selectedArea.maxY
    },

    checkRowSelectedAll (y) {
      return this.checkRowSelected(y) && this.selectedArea.maxX === Infinity
    },

    mergeCells () {
      this.cellMenu.visible = false
      // 选择区域的计算
      if (this.selectedArea.minX === this.selectedArea.maxX && this.selectedArea.minY === this.selectedArea.maxY) {
        // 单个单元格
        return
      }

      // 插入合并单元格
      this.mergedCells.push({
        x: this.selectedArea.minX,
        y: this.selectedArea.minY,
        w: this.selectedArea.maxX - this.selectedArea.minX + 1,
        h: this.selectedArea.maxY - this.selectedArea.minY + 1
      })

      this.calcIgnoreCells()
    },

    calcIgnoreCells () {
      // 计算合并单元格
      this.mergedCells.forEach(cell => {
        // 
        for (let i = cell.x, l = cell.x + cell.w; i < l; i++) {
          for (let j = cell.y, k = cell.y + cell.h; j < k; j++) {
            this.$set(this.ignoreCells, this.calcCellName(i, j), 1)
          }
        }
        // 排除自己
        this.$delete(this.ignoreCells, this.calcCellName(cell.x, cell.y))
      })
    },

    splitCells () {
      this.cellMenu.visible = false
    },

    checkIgnoreCell (x, y) {
      // 判断是否是禁止生成的单元格
      return this.calcCellName(x, y) in this.ignoreCells
    },

    getMergedConfig (x, y) {
      return this.mergedCells.find(item => item.x === x && item.y === y)
    },

    calcRowSpan (x, y) {
      let mergedCell = this.getMergedConfig(x, y)
      return (mergedCell && mergedCell.h) || null
    },

    calcColSpan (x, y) {
      // 获取唯一标志
      // let name = this.calcColName(x) + y
      // 根据唯一标志获取跨行的情况
      let mergedCell = this.getMergedConfig(x, y)
      return (mergedCell && mergedCell.w) || null
    }
  }
}
</script>
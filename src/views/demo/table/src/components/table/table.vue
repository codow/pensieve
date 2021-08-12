<template>
  <!-- 自动生成行列 -->
  <table class="table"
         :border="border">
    <!-- 生成行列 -->
    <tr v-for="(row, rowIndex) of cellModels"
        :key="rowIndex">
      <template v-for="(cell, colIndex) of row">
        <table-cell :key="cell.uid"
                    :model="cell"
                    :row-index="rowIndex"
                    :col-index="colIndex">
          <component v-for="(item, index) of cell.children"
                     :key="index"
                     :is="item.value"></component>
        </table-cell>
      </template>
    </tr>
  </table>
</template>

<style>
.table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  box-sizing: border-box;
}
.table .cell {
  box-sizing: border-box;
}
</style>

<script>
import TableCell from '../cell'
import Cell from '../../entity/cell'

let count = 0
const getCellUID = function () {
  return 'cell' + (++count)
}

export default {
  name: 'demo-table',

  components: {
    TableCell
  },

  props: {
    border: {
      type: Boolean,
      default: false
    },
    rowNumber: {
      type: Number
    },
    colNumber: {
      type: Number
    },
    rows: {
      type: Array,
      default () {
        return []
      }
    },
    cols: {
      type: Array,
      default () {
        return []
      }
    },
    cells: {
      type: Array,
      default () {
        return []
      }
    }
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      // 统一初始化行列和单元格数据存储
      let rowL = this.rowNumber
      let colL = this.colNumber
      // 初始化单元格数据存储
      let cellModels = []
      let tempCell
      for (let i = 0; i < rowL; i++) {
        cellModels[i] = []
        for (let j = 0; j < colL; j++) {
          tempCell = Object.assign({}, this.getRowConfig(i), this.getColConfig(j), this.getCellConfig(i, j), {
            uid: getCellUID()
          })
          if (i === 2 && j === 0) {
            console.log(i, j, tempCell)
          }
          cellModels[i][j] = new Cell(tempCell)
        }
      }
      this.cellModels = cellModels
    },

    getRowConfig (rowIndex) {
      return this.rows[rowIndex] || {}
    },

    getColConfig (colIndex) {
      return this.cols[colIndex] || {}
    },

    getCellConfig (rowIndex, colIndex) {
      let row = this.cells[rowIndex] || []
      return row[colIndex] || {}
    }
  }
}
</script>
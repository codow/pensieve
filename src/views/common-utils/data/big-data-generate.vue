<template>
  <div>
    <div>操作栏：
      <el-button type="">追加列</el-button>
    </div>
    <table>
      <thead>
        <tr>
          <th @click="handleColumnClick(0, 0)">col1</th>
          <th @click="handleColumnClick(0, 1)">col2</th>
          <th @click="handleColumnClick(0, 2)">col3</th>
          <th @click="handleColumnClick(0, 3)">col4</th>
          <th @click="handleColumnClick(0, 4)">col5</th>
        </tr>
      </thead>
    </table>
    <div>
      <el-button type="" @click="generate">生成</el-button>
    </div>
    <div style="max-height: 400px;">
      {{result}}
    </div>
  </div>
</template>

<script>
import { uuid } from '../../../utils/packages/string'

const generateUUID = function (row, col, table, result, options) {
  return uuid()
}

const generateInteger = function (row, col, table, result, options) {
  table.cache = table.cache || {}
  let cache = table.cache
  cache.integer_map = cache.integer_map || {}
  let current = cache.integer_map[col.name] || 0
  current++
  cache.integer_map[col.name] = current
  return current
}

const DEFAULT_DATE_RANGE = 1000 * 60 * 60 * 24 * 365 * 5
const generateDate = function (row, col, table, result, options) {
  return new Date(new Date().getTime() - Math.floor(Math.random() * DEFAULT_DATE_RANGE))
}

const generateText = function (row, col, table, result, options) {
  options = col.options || options || {}
  let prefix = options.prefix || ''
  let stuffix = options.stuffix || ''
  return prefix + generateInteger(row, col, table, result, options) + stuffix
}

const chooseTableData = function (row, col, table, result, options) {
  options = Object.assign({}, col.options, options)
  table.cache = table.cache || {}
  let cache = table.cache
  let type = options.type || 'all'
  let data = null, index
  let relationTable = options.table
  let relationField = options.field
  let pId = options.pId || ''
  let key = 'choose_' + table.name +'_' + col.name + pId
  if (type === 'all') {
    // 按序获取
    index = cache[col.name] || 0
    data = result[relationTable][index][relationField]
    index++
    cache[col.name] = index
  } else if (type === 'random') {
    // 随机选取一个数据
    let l = result[relationTable].length
    index = Math.floor(Math.random() * l)
    let choosedRow = result[relationTable][index]
    if (choosedRow[key]) {
      for (let nextIndex = index + 1;;nextIndex ++) {
        if (nextIndex >= l) {
          nextIndex = nextIndex % l
        }
        if (nextIndex === index) {
          choosedRow = null
          break
        }
        choosedRow = result[relationTable][index]
        if (!choosedRow[key]) {
          break
        }
      }
    }
    if (choosedRow) {
      data = choosedRow[relationField]
      choosedRow[key] = true
    }
  }
  return data
}

export default {
  name: 'big-data-generate-view',
  data () {
    return {
      tables: [
        {
          name: 'test_video',
          type: 'default',
          lines: 10,
          cols: [
            { name: 'id', options: {}, type: 'UUID', mode: 'GENERATE', handler: generateUUID },
            { name: 'no', options: {}, type: 'INTEGER', mode: 'GENERATE', handler: generateInteger },
            { name: 'name', options: { prefix: 'video_' }, type: 'TEXT', mode: 'GENERATE', handler: generateText },
            { name: 'create_time', options: {}, type: 'CURRENT-DATE', mode: 'GENERATE', handler: generateDate }
          ]
        },
        {
          name: 'test_tag',
          type: 'default',
          lines: 10,
          cols: [
            { name: 'id', options: {}, type: 'UUID', mode: 'GENERATE', handler: generateUUID },
            { name: 'no', options: {}, type: 'INTEGER', mode: 'GENERATE', handler: generateInteger },
            { name: 'name', options: { prefix: 'tag_' }, type: 'TEXT', mode: 'GENERATE', handler: generateText },
            { name: 'create_time', options: {}, type: 'CURRENT-DATE', mode: 'GENERATE', handler: generateDate }
          ]
        },
        {
          name: 'test_video_tag',
          type: 'relation', // 笛卡尔集关联
          relation_cols: [1, 2],
          cols: [
            { name: 'id', options: {}, type: 'INTEGER', mode: 'GENERATE', handler: generateInteger },
            { name: 'video_id', options: { table: 'test_video', field: 'id', type: 'all' }, type: 'OTHER', mode: 'CHOOSE', handler: chooseTableData },
            { name: 'tag_id', options: { table: 'test_tag', field: 'id', type: 'random', max: 5 }, type: 'OTHER', mode: 'CHOOSE', handler: chooseTableData }
          ]
        },
        // {
        //   name: 'test_video_tag_map',
        //   lines: 1000,
        //   cols: [
        //     { name: 'video_id', options: { table: '', field: '',  }, type: 'OTHER', handler: chooseTableData },
        //     { name: 'tag_id', options: {}, type: 'INTEGER', handler: chooseRandomData }
        //   ]
        // }
      ],
      types: [
        { label: 'UUID', handler: generateUUID },
        { label: 'INTEGER', handler: generateInteger },
        { label: 'DATE', handler: generateDate },
        { label: 'CURRENT-DATE', options: { isNow: true }, handler: generateDate },
        { label: 'TEXT', handler: generateText }
      ],
      result: {}
    }
  },
  methods: {
    generate () {
      let result = {}
      this.tables.forEach(table => {
        let data
        if (table.type === 'relation') {
          data = this.generateRelationTable(table, result)
        } else {
          data = this.generateTable(table, result)
        }
        result[table.name] = data
      })
      this.result = result
    },

    generateTable (table, result) {
      let i = 0, l = table.lines
      let tableName = table.name
      let data = []
      let row
      for (; i < l; i++) {
        row = {}
        table.cols.forEach(col => {
          this.generateRow(row, col, table, result)
        })
        data.push(row)
      }
      return data
    },

    generateRelationTable (table, result) {
      let relationCols = table.relation_cols.map(i => {
        return table.cols[i]
      })
      let cols = table.cols.filter((item, i) => {
        return !table.relation_cols.includes(i)
      })
      return this.generateRelationRows(relationCols, table, result, cols) || []
    },

    generateRow (row, col, table, result, options) {
      if (!col.handler) return
      row[col.name] = col.handler(row, col, table, result, options)
    },

    generateRelationRows (relationCols, table, result, cols, pRow, pId, index) {
      pId = pId || ''
      index = index || 0
      let relationCol = relationCols[index]
      let lastRelationCol = index === relationCols.length - 1
      let options = relationCol.options || {}
      let relationTable = options.table
      let relationField = options.field
      let relationType = options.type
      let min = Math.max(options.min || 0, 0)
      let max = Math.min(options.max || result[relationTable].length, result[relationTable].length)
      let i = 0, l = max
      if (relationType === 'random') {
        l = Math.floor(min + Math.random() * (max - min))
      }
      let data = []
      let row
      for (; i < l; i++) {
        row = Object.assign({}, pRow)
        // 生成当前行的数据
        this.generateRow(row, relationCol, table, result, {
          pId: pId
        })
        if (lastRelationCol) {
          cols.forEach(col => this.generateRow(row, col, table, result))
          data.push(row)
        } else {
          data = data.concat(this.generateRelationRows(relationCols, table, result, cols, row, pId + '_' + row[relationCol.name], index + 1))
        }
      }
      return data
    },

    handleColumnClick () {

    }
  }
}
</script>
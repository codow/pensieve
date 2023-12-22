<template>
  <div>
    <el-form :model="options"
             class="padding__medium"
             label-position="right"
             label-width="100px">
      <el-form-item label="起始列号"
                    prop="startCol">
        <el-input-number v-model="options.startCol"
                         class="width__full"></el-input-number>
      </el-form-item>
      <el-form-item label="列数"
                    prop="colNumber">
        <el-input-number v-model="options.colNumber"
                         class="width__full"></el-input-number>
      </el-form-item>
      <el-form-item label="数据行号"
                    prop="rowIndex">
        <el-input-number v-model="options.rowIndex"
                         class="width__full"></el-input-number>
      </el-form-item>
      <el-form-item label="表名"
                    prop="tableName">
        <el-input v-model="options.tableName"></el-input>
      </el-form-item>
      <el-form-item label="常量列名"
                    prop="constColumnNames">
        <el-input v-model="options.constColumnNames"></el-input>
      </el-form-item>
      <el-form-item label="常量数据"
                    prop="constColumnValues">
        <el-input v-model="options.constColumnValues"></el-input>
      </el-form-item>
      <el-form-item label="替换换行符">
        <el-switch v-model="options.replaceEnter"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="generate">生成</el-button>
      </el-form-item>
      <el-form-item label="字段部分输出">
        <el-input type="textarea"
                  rows="8"
                  v-model="fieldOutData"></el-input>
      </el-form-item>
      <el-form-item label="值部分输出">
        <el-input type="textarea"
                  rows="8"
                  v-model="valueOutData"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { numberToName } from '../../../utils/packages/excel'

export default {
  name: 'ExcelSqlConcatGenerate',
  data() {
    return {
      options: {
        startCol: 1,
        colNumber: 10,
        rowIndex: 2,
        tableName: 'table',
        replaceEnter: true
      },
      fieldOutData: null,
      valueOutData: null
    }
  },
  methods: {
    generate() {
      const {
        startCol,
        colNumber,
        rowIndex,
        tableName,
        constColumnNames,
        constColumnValues,
        replaceEnter
      } = this.options
      const fieldRowIndex = rowIndex - 1
      let col
      let valueOutData = '="('
      let fieldOutData = '="INSERT INTO ' + tableName + ' ('
      if (constColumnNames) {
        fieldOutData = fieldOutData + constColumnNames + ','
      }
      if (constColumnValues) {
        valueOutData = valueOutData + constColumnValues + ','
      }
      for (let i = 0; i < colNumber; i++) {
        col = numberToName(startCol + i)
        if (replaceEnter) {
          valueOutData +=
            '"&IF(ISBLANK(' +
            col +
            rowIndex +
            '), "NULL", "\'"&SUBSTITUTE(SUBSTITUTE(' +
            col +
            rowIndex +
            ',CHAR(10),"\\n"), CHAR(39), "\\\'")&"\'")&", '
        } else {
          valueOutData +=
            '"&IF(ISBLANK(' +
            col +
            rowIndex +
            '), "NULL", "\'"&' +
            col +
            rowIndex +
            '&"\'")&", '
        }
        fieldOutData += '"&' + col + fieldRowIndex + '&", '
      }
      valueOutData = valueOutData.substring(0, valueOutData.length - 2)
      valueOutData += '),"'
      fieldOutData = fieldOutData.substring(0, fieldOutData.length - 2)
      fieldOutData += ') values "'
      this.valueOutData = valueOutData
      this.fieldOutData = fieldOutData
    }
  }
}
</script>
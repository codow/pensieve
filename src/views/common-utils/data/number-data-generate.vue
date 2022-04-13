<template>
  <div>
    <el-form label-position="top" class="padding__medium">
      <el-row>
        <el-col :span="4">
          <el-form-item label="生成个数">
            <el-input-number v-model="size"
                             :min="0"
                             :precision="0"
                             style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="起始数值">
            <el-input-number v-model="startNumber" style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="基础数值">
            <el-input-number v-model="basicNumber" style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="精度">
            <el-input-number v-model="precision" style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button @click="generate">生成</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="9"
                :offset="1">
          <el-form-item label="输入数据">
            <el-input v-model="inputData"
                      type="textarea"
                      :rows="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9"
                :offset="1">
          <el-form-item label="输出数据">
            <el-input v-model="outputData"
                      type="textarea"
                      :rows="20"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import * as numberUtils from '../../../utils/packages/number'

export default {
  name: 'number-data-generate-view',
  data () {
    return {
      size: 10,
      startNumber: 0,
      basicNumber: 1000,
      precision: 2,
      separator: null,
      inputData: null,
      outputData: null
    }
  },
  methods: {
    generate () {
      let { size, startNumber, basicNumber, precision, inputData, separator } = this
      // 处理默认数据
      size = size || 10
      startNumber = startNumber === null || startNumber === undefined ? 0 : startNumber
      basicNumber = basicNumber === null || startNumber === undefined ? 1000 : basicNumber
      precision = basicNumber === null || startNumber === undefined ? 2 : precision
      inputData = (inputData || '').trim()
      separator = separator || '\\n'
      separator = separator.replaceAll(/\\{2}/g, '\\')
      separator = eval('("' + separator + '")')
      if (inputData) {
        inputData = inputData.split(separator)
      } else {
        inputData = []
      }
      let result = ''
      let increment
      let lastNumber
      for (let i = 0; i < size; i++) {
        lastNumber = numberUtils.isNumber(inputData[i]) ? +inputData[i] : startNumber
        increment = Math.random() * basicNumber
        result += numberUtils.toFixed(lastNumber + increment, precision)
        if (i !== size - 1) {
          result += separator
        }
      }
      this.outputData = result
    }
  }
}
</script>
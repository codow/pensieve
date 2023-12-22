<template>
  <div>
    <el-form label-position="top"
             class="padding__medium">
      <el-row>
        <el-col :span="4">
          <el-form-item label="生成个数">
            <el-input-number v-model="size"
                             :min="0"
                             :precision="0"
                             style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button @click="generate">生成</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="19"
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
import * as stringUtils from '../../../utils/packages/string'

export default {
  name: 'NumberDataGenerateView',
  data() {
    return {
      size: 10,
      separator: null,
      inputData: null,
      outputData: null
    }
  },
  methods: {
    generate() {
      let { size, separator } = this
      // 处理默认数据
      size = size || 10
      separator = separator || '\\n'
      separator = separator.replaceAll(/\\{2}/g, '\\')
      separator = eval('("' + separator + '")')
      let result = ''
      for (let i = 0; i < size; i++) {
        result += stringUtils.uuid()
        if (i !== size - 1) {
          result += separator
        }
      }
      this.outputData = result
    }
  }
}
</script>
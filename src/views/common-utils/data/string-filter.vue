<template>
  <div class="padding__medium">
    <el-form label-position="top">
      <el-row>
        <el-col :span="10">
          <el-form-item label="输入">
            <el-input type="textarea"
                      :rows="20"
                      v-model="originalData"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="　">
            <div class="margin-horizontal__medium align__center">
              <el-button type="primary"
                         icon="el-icon-d-arrow-left"
                         @click="rightToLeft"></el-button>
            </div>
            <div class="margin-top__medium margin-horizontal__medium align__center">
              <el-button type="primary"
                         @click="toCamelCase">驼峰命名</el-button>
            </div>
            <div class="margin-top__medium margin-horizontal__medium align__center">
              <el-button type="primary"
                         @click="sortASC">正向排序</el-button>
            </div>
            <div class="margin-top__medium margin-horizontal__medium align__center">
              <el-button type="primary"
                         @click="sortDESC">逆向排序</el-button>
            </div>
            <div class="margin-top__medium margin-horizontal__medium align__center">
              <el-button type="primary"
                         @click="urlEncode">UrlEncode</el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="输出">
            <el-input type="textarea"
                      :rows="20"
                      readonly
                      v-model="exportData"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form :model="options"
             label-position="right"
             label-width="100px">
      <el-collapse v-model="activeName"
                   accordion
                   class="border-collapse">
        <el-collapse-item title="根据行号筛选"
                          name="1">
          <el-form-item label="余数">
            <el-input-number v-model="options.remainder"
                             class="width__full"></el-input-number>
          </el-form-item>
          <el-form-item label="基数">
            <el-input-number v-model="options.baseNumber"
                             class="width__full"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="lineNumberFilter">筛选</el-button>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="正则表达式替换"
                          name="2">
          <el-form-item label="正则表达式">
            <el-input v-model="options.regexStr"></el-input>
          </el-form-item>
          <el-form-item label="替换表达式">
            <el-input v-model="options.replaceStr"></el-input>
          </el-form-item>
          <el-form-item label="字符串分割">
            <el-input v-model="options.splitStr"></el-input>
          </el-form-item>
          <el-form-item label="替换方法">
            <el-input v-model="options.replaceFuncStr"
                      type="textarea"
                      :rows="4"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="regexReplace">执行</el-button>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="正则表达式筛选"
                          name="3">
          <el-form-item label="正则表达式">
            <el-input v-model="options.screenRegexStr"></el-input>
          </el-form-item>
          <el-form-item label="分隔符">
            <el-input v-model="options.screenStr"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="regexScreen">执行</el-button>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="数据排重"
                          name="4">
          <el-form-item label="分隔符">
            <el-input v-model="options.eliminateDuplicationStr"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="eliminateDuplication">执行</el-button>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>

<script>
import _camelCase from 'lodash/camelCase'

export default {
  name: 'data-string-filter',
  data () {
    return {
      activeName: '1',
      originalData: null,
      exportData: null,
      options: {
        remainder: 0,
        baseNumber: 1,
        eliminateDuplicationStr: '\\n'
      }
    }
  },
  methods: {
    rightToLeft () {
      this.originalData = this.exportData
    },
    getOriginalData () {
      let { originalData } = this
      originalData = originalData || ''
      originalData = originalData.trim()
      return originalData
    },
    toCamelCase () {
      const originalData = this.getOriginalData()
      if (!originalData) return
      const originalDataArr = originalData.split(/\n/)
      const exportDataArr = originalDataArr.map(item => _camelCase(item))
      this.exportData = exportDataArr.join('\n')
    },
    lineNumberFilter () {
      //获取原始数据
      const originalData = this.getOriginalData()
      if (!originalData) return
      let { baseNumber, remainder } = this.options
      baseNumber = +baseNumber
      baseNumber = !baseNumber ? 1 : baseNumber
      remainder = +remainder
      remainder = !remainder ? 0 : remainder
      //格式化数据
      const originaDataArray = originalData.split("\n")
      const exportDataArray = originaDataArray.filter((item, i) => {
        if ((i + 1) % baseNumber == remainder) {
          return true
        }
      })
      this.exportData = exportDataArray.join("\n")
    },
    regexReplace () {
      const originalData = this.getOriginalData() //原始数据
      if (!originalData) return
      let { regexStr, replaceStr, splitStr, replaceFuncStr } = this.options
      if (!regexStr) return
      //处理正则表达式
      const opt = 'gi'
      let strArray = []
      let splitArray = []
      if (splitStr) {
        // 创建分割正则表达式
        const splitRegexObj = eval("new RegExp('" + splitStr + "', '" + opt + "')")
        // 记录分割符
        splitArray = [].concat(originalData.match(splitRegexObj))
        // 替换分隔符
        strArray = [].concat(originalData.split(splitRegexObj))
      } else {
        strArray = [originalData]
      }
      const regexObj = eval("new RegExp('" + regexStr + "', '" + opt + "')")
      // 处理替换的字符串
      if (!replaceStr) {
        replaceStr = ''
      } else {
        replaceStr = eval("'" + replaceStr + "'")
      }
      var replaceFunc = null
      if (replaceFuncStr) {
        replaceFunc = eval("(function() {return " + replaceFuncStr + "})()")
      }
      strArray = strArray.map(function (subStr) {
        return subStr.replace(regexObj, replaceFunc || replaceStr)
      })
      let exportData = ""
      strArray.forEach((subStr, index) => {
        exportData += subStr + (splitArray[index] || '')
      })
      this.exportData = exportData
    },
    regexScreen () {
      const originalData = this.getOriginalData() //原始数据
      if (!originalData) return
      let { screenRegexStr, screenStr } = this.options
      if (!screenRegexStr) return
      //处理正则表达式
      const opt = 'g'
      screenRegexStr = screenRegexStr.replaceAll("\\", "\\\\")
      const regexObj = eval("new RegExp('" + screenRegexStr + "', '" + opt + "')")
      // 处理替换的字符串
      screenStr = eval("'" + screenStr + "'")
      //执行match
      const resultArray = originalData.match(regexObj) || []
      this.exportData = resultArray.join(screenStr)
    },
    eliminateDuplication () {
      const originalData = this.getOriginalData() //原始数据
      if (!originalData) return
      let { eliminateDuplicationStr } = this.options
      if (!eliminateDuplicationStr) return
      eliminateDuplicationStr = eval("'" + eliminateDuplicationStr + "'")
      const array = originalData.split(eliminateDuplicationStr)
      const map = {}
      const resultArray = array.filter(item => {
        if (!map[item]) {
          map[item] = true
          return true
        }
      })
      this.exportData = resultArray.join(eliminateDuplicationStr)
    },
    sortASC () {
      const originalData = this.getOriginalData()
      if (!originalData) return
      // 分割数据
      let originaDataArray = originalData.split('\n')
      // 排序
      originaDataArray = originaDataArray.sort()
      this.exportData = originaDataArray.join('\n')
    },
    sortDESC () {
      const originalData = this.getOriginalData()
      if (!originalData) return
      // 分割数据
      let originaDataArray = originalData.split('\n')
      originaDataArray = originaDataArray.sort((a, b) => {
        return -a.localeCompare(b)
      })
      this.exportData = originaDataArray.join('\n')
    },
    urlEncode () {
      const originalData = this.getOriginalData()
      if (!originalData) return
      this.exportData = window.encodeURI(originalData)
    }
  }
}
</script>

<style>
.border-collapse.el-collapse {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.border-collapse.el-collapse
  > .el-collapse-item:first-child
  > div[role="tab"]
  > .el-collapse-item__header {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.border-collapse.el-collapse
  > .el-collapse-item:last-child
  > div[role="tab"]
  > .el-collapse-item__header {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.border-collapse.el-collapse
  > .el-collapse-item
  > div[role="tab"]
  > .el-collapse-item__header {
  padding-left: 10px;
  background-color: #f5f7fa;
}

.border-collapse.el-collapse
  > .el-collapse-item
  > div[role="tab"]
  > .el-collapse-item__header.is-active {
  border-bottom: 1px solid #ebeef5;
}

.border-collapse.el-collapse
  > .el-collapse-item
  > .el-collapse-item__wrap
  > .el-collapse-item__content {
  padding: 10px;
}
</style>
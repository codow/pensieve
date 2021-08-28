<template>
  <div class="padding__small">
    <el-form label-position="top">
      <el-row>
        <el-col :span="7">
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
                         @click="generateTestData(3)">生成测试数据</el-button>
            </div>
            <div class="margin-top__medium margin-horizontal__medium align__center">
              <el-button type="primary"
                         @click="generateTreeData">生成树型数据</el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="输出">
            <el-input type="textarea"
                      :rows="20"
                      readonly
                      v-model="exportData"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5"
                :offset="1">
          <el-form-item label="预览">
            <div class="padding__mini"
                 style="height: 420px; border: 1px solid #DCDFE6; border-radius: 4px; overflow: auto;">
              <el-tree :data="exportTreeData"
                       default-expand-all></el-tree>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import JSONBeautify from 'json-beautify'
import { fillStr } from '../../../utils/packages/string'

export default {
  name: 'TreeDataHandler',
  data () {
    return {
      originalData: null,
      exportData: null,
      exportTreeData: [],
      options: {
        remainder: 0,
        baseNumber: 1
      }
    }
  },
  methods: {
    generateTestData (level) {
      // 生成多少层数据
      level = level || 3
      // 生成第一层数据
      let data = this.generateLevelData(null, 'item')
      let levelData = data
      let nextLevelData
      // 取每一层的数据宽度
      for (let i = 1; i < level; i++) {
        nextLevelData = []
        levelData.forEach(item => {
          let next = this.generateLevelData(item.id, item.label)
          nextLevelData = nextLevelData.concat(next)
          data = data.concat(next)
        })
        levelData = nextLevelData
      }
      this.originalData = JSONBeautify(data, null, 2, 100)
    },
    generateLevelData (parentId, parentLabel) {
      parentId = parentId || ''
      parentLabel = parentLabel || ''
      let levelWidth = this.generateRandomNumber(5)
      let id, label
      let data = []
      for (let i = 0; i < levelWidth; i++) {
        id = i + 1
        id = parentId + fillStr(id, 3, '0')
        label = i + 1
        label = parentLabel ? parentLabel + '-' + label : label
        data.push({
          id,
          parentId,
          label
        })
      }
      return data
    },
    generateTreeData () {
      let originalData = this.getOriginalData()
      if (!originalData) {
        return
      }
      originalData = eval('(' + originalData + ')')
      // 处理数据
      let exportData = this.toTreeData(originalData)
      this.exportTreeData = exportData
      this.exportData = JSONBeautify(exportData, null, 2, 100)
    },
    toTreeData (list) {
      let result = []
      // 缓存有哪些数据
      let itemMap = {}
      list = list.map(item => {
        item = Object.assign({}, item)
        itemMap[item.id] = item
        return item
      })
      let childrenMap = {}
      let children
      // 将每个数据分配到对应的集合中
      list.forEach(item => {
        // 查询当前属于那个列表
        if (!itemMap[item.parentId]) {
          result.push(item)
          return item
        }
        children = childrenMap[item.parentId]
        if (!children) {
          children = []
          childrenMap[item.parentId] = children
        }
        children.push(item)
        return item
      })
      // 将下级节点数组分配到对应的数据下
      for (let parentId in childrenMap) {
        itemMap[parentId].children = childrenMap[parentId]
      }
      return result
    },
    generateRandomNumber (maxNumber) {
      // 取 1 ~ maxNumber 之间的随机数
      return Math.random() * (maxNumber - 1) + 1
    },
    rightToLeft () {
      this.originalData = this.exportData
    },
    getOriginalData () {
      let { originalData } = this
      originalData = originalData || ''
      originalData = originalData.trim()
      return originalData
    }
  }
}
</script>

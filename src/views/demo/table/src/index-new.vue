<template>
  <div>
    <div>新版表格布局</div>
    <div style="margin-top: 20px;">
      <div>
        <el-button type=""
                   @click="generateTableJson">生成JSON</el-button>
      </div>
      <el-container>
        <el-aside width="200px"
                  style="padding-top: 20px;">
          <div v-draggable="{ selector: '.tool', drop: false, clone: true, model: tools }"
               style="border: 1px solid #afafaf;height: 600px;">
            <div v-for="(item, index) of tools"
                 :key="index"
                 class="tool">{{item.label}}</div>
          </div>
        </el-aside>
        <el-main v-draggable="{ delay: 500, drop: false }">
          <demo-table-layout ref="table"></demo-table-layout>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<style>
.tool {
  padding: 10px;
  border-bottom: 1px solid #afafaf;
}
</style>

<script>
import DemoTableLayout from './components/table/index-new'

import draggable from './directives/draggable'

export default {
  name: 'demo-table-new',

  components: {
    DemoTableLayout
  },

  directives: {
    draggable
  },

  data () {
    return {
      visible: true,
      choosedCells: {},
      continuousChoosedCells: [],
      tools: [
        {
          value: 'el-input',
          label: '文本框'
        },
        {
          value: 'el-button',
          label: '按钮'
        },
        {
          value: 'el-switch',
          label: '开关'
        }
      ]
    }
  },

  methods: {
    chooseCell (cellId) {
      this.choosedCells = {}
      this.continuousChoosedCells = []
      this.$set(this.choosedCells, cellId, true)
      this.continuousChoosedCells.push()
    },

    checkCellChose (cellId) {
      return cellId in this.choosedCells
    },

    openContinuousChoose () {
      this.continuousChoose = true
    },

    closeContinuousChoose () {
      this.continuousChoose = false
    },

    continuousChooseCell (cellId) {
      this.continuousChoosedCells.push(cellId)
    },

    uncontinuousChooseCell (cellId) {
      window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
      let index = this.continuousChoosedCells.indexOf(cellId)
      this.continuousChoosedCells.splice(index, 1)
    },

    generateTableJson () {
      console.log(this.$refs.table.toJSON())
    }
  }
}
</script>
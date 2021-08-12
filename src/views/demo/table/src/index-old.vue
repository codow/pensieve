<template>
  <div>
    <div>旧版表格布局</div>
    <div style="margin-top: 20px;">
      <el-container>
        <el-aside width="200px">
          <VueDraggable v-model="tools"
                        :group="{ name: 'tools', pull: 'clone', put: false }"
                        :sort="false">
            <div v-for="(item, index) of tools"
                 :key="index">{{item.label}}</div>
          </VueDraggable>
        </el-aside>
        <el-main>
          <demo-table-layout></demo-table-layout>
        </el-main>
      </el-container>
    </div>
  </div>
</template> 

<script>
import VueDraggable from 'vuedraggable'
import DemoTableLayout from './components/table/index-old'

export default {
  name: 'demo-table-old',

  components: {
    VueDraggable,
    DemoTableLayout
  },

  data () {
    return {
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
    }
  }
}
</script>
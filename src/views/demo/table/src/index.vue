<template>
  <div>
    <div>表格布局测试</div>
    <div>
      <router-link to="/demo/table/new">新版</router-link>
      <router-link to="/demo/table/old">旧版</router-link>
      <router-link to="/demo/table/data">数据初始化</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import draggable from './directives/draggable'

export default {
  name: 'demo-table',

  directives: {
    draggable
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
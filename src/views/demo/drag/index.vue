<template>
  <div class="padding__medium">
    <div>拖拽排序</div>
    <div ref="sortArea"
         class="sort-wrap margin-top__medium">
      <div v-for="item in sortList"
           :key="item.id"
           class="sort-item">
        {{item.label}} : {{getTimestamp()}}
        <!-- <el-input v-model="item.label"></el-input> -->
      </div>
    </div>
    <div class="margin-top__medium">
      <el-input v-if="inputElVisible"
                ref="inputEl"
                type="textarea"
                rows="5"
                v-model="sortListStr"></el-input>

    </div>
    <div>
      <div>输入框测试</div>
      <el-input-number v-model="formData.number"></el-input-number>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'

export default {
  name: 'demo-drag',
  data () {
    return {
      formData: { number: null },
      sortInstance: null,
      inputElVisible: true
    }
  },
  created () {
    this.sortList = [{
      id: '1',
      label: 'item-1'
    }, {
      id: '2',
      label: 'item-2'
    }, {
      id: '3',
      label: 'item-3'
    }, {
      id: '4',
      label: 'item-4'
    }, {
      id: '5',
      label: 'item-5'
    }]
    this.updateSortListStr()
  },
  mounted () {
    this.initSortArea()
  },
  destroyed () {
    this.destorySortArea()
  },
  methods: {
    initSortArea () {
      const { sortArea } = this.$refs
      console.log('sortArea', sortArea)
      const _vm = this
      this.sortInstance = new Sortable(sortArea, {
        animation: 150,
        // 结束拖拽
        onEnd: function (evt) {
          // 替换
          const { sortList } = _vm
          sortList.splice(evt.newIndex, 0, sortList.splice(evt.oldIndex, 1)[0])
          _vm.updateSortListStr()
        }
      })
    },
    destorySortArea () {
      if (this.sortInstance) {
        this.sortInstance.destroy()
        this.sortInstance = null
      }
    },
    getTimestamp () {
      return new Date().getTime()
    },
    updateSortListStr () {
      this.sortListStr = JSON.stringify(this.sortList)
      const { inputEl } = this.$refs
      inputEl && inputEl.$forceUpdate()
    }
  }
}
</script>

<style>
.sort-wrap {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  width: 400px;
  padding: 20px;
}
.sort-item {
  /* border: 1px solid #ebeef5;
  border-radius: 4px;
  line-height: 32px;
  padding: 4px; */
}
.sort-item + .sort-item {
  margin-top: 10px;
}
</style>
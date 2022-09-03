<template>
  <div class="padding__medium">
    <div style="padding: 20px 0">表单管理</div>
    <div class="drag-item-line">
      <div class="drag-item-line__dot"></div>
    </div>

    <div style="padding: 20px 0">拖拽测试</div>
    <draggable v-model="list"
               v-bind="dragOptions">
      <div v-for="item in list"
           :key="item.id"
           class="drag-item">{{item.name}}</div>
    </draggable>

    <div style="padding: 20px 0">自定义拖拽拖拽</div>
    <div ref="dragContainer">
      <div v-for="item in list"
           :key="item.id"
           class="drag-item">{{item.name}}</div>
    </div>
  </div>
</template>

<style>
.drag-item {
  border: 1px solid #afafaf;
  padding: 10px 15px;
  width: 200px;
}
.drag-item + .drag-item {
  margin-top: 10px;
}
.drag-item.highlighted {
  background: #3f9f3f;
}
.drag-item.selected {
  border-color: #9f3f3f;
}
</style>

<script>
import { Sortable } from 'sortablejs/modular/sortable.core.esm'

export default {
  name: 'form-manage-view',
  data () {
    return {
      dragOptions: {
        // swap: true,
        // swapClass: 'highlighted',
        multiDrag: true, // Enable the plugin
        selectedClass: "selected", // Class name for selected item
        animation: 150
      },
      list: [
        { id: 1, name: 'item1' },
        { id: 2, name: 'item2' },
        { id: 3, name: 'item3' },
        { id: 4, name: 'item4' },
        { id: 5, name: 'item5' },
        { id: 6, name: 'item6' }
      ],
      dragInstance: null
    }
  },
  mounted () {
    const { dragContainer } = this.$refs
    this.dragInstance = new Sortable(dragContainer, {
      swap: true,
      swapClass: 'highlighted',
      multiDrag: true, // Enable the plugin
      selectedClass: "selected", // Class name for selected item
      animation: 150
    })
  },
  destroyed () {
    if (this.dragInstance) {
      this.dragInstance.destroy()
      this.dragInstance = null
    }
  }
}
</script>
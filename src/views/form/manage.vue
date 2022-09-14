<template>
  <div class="padding__medium">
    <div style="padding: 20px 0">表单管理</div>
    <div class="sortable-drop-line">
      <div class="sortable-drop-line__dot"></div>
      <div class="sortable-drop-line__line"></div>
    </div>

    <div class="sortable-drag-image"
         draggable="true">
      哈哈哈
    </div>

    <div ref="domDragContainer"
         style="height: 400px; background: #fff; border: 1px dashed #0063ff;"></div>

    <div style="padding: 20px 0">拖拽测试</div>
    <el-row>
      <el-col :xl="4">
        <draggable v-model="list"
                   group="form"
                   v-bind="dragOptions"
                   class="drag-wrapper">
          <div v-for="item in list"
               :key="item.id"
               class="drag-item">{{item.name}}</div>
        </draggable>
      </el-col>
      <el-col :xl="4">
        <draggable v-model="list2"
                   group="form"
                   v-bind="dragOptions"
                   class="drag-wrapper">
          <div v-for="item in list2"
               :key="item.id"
               class="drag-item">{{item.name}}</div>
        </draggable>
      </el-col>
    </el-row>

    <div style="padding: 20px 0">自定义拖拽拖拽</div>
    <el-row>
      <el-col :xl="4">
        <div ref="dragContainer"
             class="drag-wrapper">
          <div v-for="item in list"
               :key="item.id"
               class="drag-item">{{item.name}}</div>
        </div>
      </el-col>
      <el-col :xl="4">
        <div ref="dragContainer2"
             class="drag-wrapper">
          <div v-for="item in list"
               :key="item.id"
               class="drag-item">{{item.name}}</div>
        </div>
      </el-col>

      <el-col :xl="4">
        <div ref="dragContainer3"
             class="drag-wrapper">
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="less">
.drag-wrapper {
  width: 200px;
  min-height: 200px;
  background: #fff;
}

.drag-item {
  border: 1px solid #afafaf;
  padding: 10px 15px;
}
.drag-item + .drag-item {
  margin-top: 10px;
}
/* .drag-item.highlighted {
  background: #3f9f3f;
} */
.drag-item.selected {
  border-color: #9f3f3f;
}
</style>

<script>
import { Sortable } from 'sortablejs/modular/sortable.core.esm'
// import Sortable from 'sortablejs'

export default {
  name: 'form-manage-view',
  data () {
    return {
      dragOptions: {
        plain: true,
        // multiDrag: true, // Enable the plugin
        // selectedClass: "selected", // Class name for selected item
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
      list2: [],
      dragInstance: null
    }
  },
  mounted () {
    const { dragContainer, dragContainer2, dragContainer3, domDragContainer } = this.$refs
    this.dragInstance = new Sortable(dragContainer, {
      plain: true,
      multiDrag: true, // Enable the plugin
      selectedClass: "selected", // Class name for selected item
      group: 'test',
      animation: 150
    })

    this.dragInstance2 = new Sortable(dragContainer2, {
      // swap: true,
      plain: true,
      swapClass: 'highlighted',
      multiDrag: true, // Enable the plugin
      selectedClass: "selected", // Class name for selected item
      group: 'test',
      animation: 150
    })

    this.dragInstance3 = new Sortable(dragContainer3, {
      // swap: true,
      plain: true,
      swapClass: 'highlighted',
      multiDrag: true, // Enable the plugin
      selectedClass: "selected", // Class name for selected item
      group: 'test',
      animation: 150
    })

    domDragContainer.ondragover = function (e) {
      e.preventDefault()
    }
  },
  destroyed () {
    if (this.dragInstance) {
      this.dragInstance.destroy()
      this.dragInstance = null
    }
    if (this.dragInstance2) {
      this.dragInstance2.destroy()
      this.dragInstance2 = null
    }
    if (this.dragInstance3) {
      this.dragInstance3.destroy()
      this.dragInstance3 = null
    }
  },

  methods: {
  }
}
</script>
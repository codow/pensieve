<template>
  <div class="padding__small">
    <div>CSS游标</div>
    <ul class="cursor-list">
      <li v-for="icon in cursors"
          :key="icon"
          class="cursor-list-item">
        <span :style="{ cursor: icon }"
              @click="handleIconClick(icon)">{{ icon }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { copyToClipboard } from '@/utils/packages/dom'

export default {
  name: 'DemoCssCursor',
  data() {
    return {
      cursors: [
        'alias',
        'all-scroll',
        'auto',
        'cell',
        'col-resize',
        'context-menu',
        'copy',
        'crosshair',
        'default',
        'e-resize',
        'ew-resize',
        'grab',
        'grabbing',
        'help',
        'inherit',
        'initial',
        'move',
        'n-resize',
        'ne-resize',
        'nesw-resize',
        'no-drop',
        'none',
        'not-allowed',
        'ns-resize',
        'nw-resize',
        'nwse-resize',
        'pointer',
        'progress',
        'revert',
        'row-resize',
        's-resize',
        'se-resize',
        'sw-resize',
        'text',
        'unset',
        'vertical-text',
        'w-resize',
        'wait',
        'zoom-in',
        'zoom-out',
        '-webkit-grab',
        '-webkit-grabbing',
        '-Webkit-zoom-in',
        '-webkit-zoom-out'
      ]
    }
  },
  methods: {
    handleIconClick(item) {
      copyToClipboard(item)
      this.$message.success('复制成功')
    }
  }
}
</script>

<style>
.cursor-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
}
.cursor-list-item {
  border: 1px solid #efefef;
  background: #ffffff;
  border-radius: 5px;
  height: 78px;
  width: 78px;
  margin: 10px;
  padding: 5px;
  line-height: 80px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
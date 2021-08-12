<template>
  <td ref="td"
      :class="tdClass"
      :style="tdStyle"
      :row="rowIndex"
      :col="colIndex"
      :model="model.children"
      @mousedown="handleCellSelect"
      @mouseenter="handleCellContSelect"
      @contextmenu="handleCellMenuOpen">
    <slot></slot>
  </td>
</template>

<script>
import baseCellMixin from './mixin/base-cell'

export default {
  name: 'col-header-cell',

  mixins: [baseCellMixin],

  computed: {
    tdClass () {
      return {
        'selected': this.model.selected,
        'selected-all': this.model.selectedAll,
        [`cell-${this.rowIndex}-${this.colIndex}`]: true
      }
    },
    tdStyle () {
      let style = {}
      // 宽高设置
      if (this.model.width) {
        style.width = this.model.width
      }
      return style
    }
  }
}
</script>
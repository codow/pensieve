<template>
  <td v-if="!model.merged && !loading"
      ref="td"
      class="cell"
      :row="rowIndex"
      :col="colIndex"
      :class="tdClass"
      :style="tdStyle"
      :colspan="model.colSpan"
      :rowspan="model.rowSpan"
      :contentEditable="contentEditable"
      @mousedown="handleCellSelect"
      @mouseenter="handleCellContSelect"
      @dblclick="handleCellDblclick"
      @contextmenu="handleCellMenuOpen"
      @blur="handleBlur">
    <slot>
      {{model.text}}
    </slot>
  </td>
</template>

<script>
import baseCellMixin from './mixin/base-cell'

export default {
  name: 'cell',

  mixins: [baseCellMixin],

  data () {
    return {
      loading: false
    }
  },

  methods: {
    handleBlur () {
      let text = this.$refs.td.innerText
      this.$refs.td.innerHTML = ''
      this.model.text = text
      this.loading = true
      this.$nextTick(() => {
        this.loading = false
      })
    }
  }
}
</script>
<template>
  <tr :class="{[`row-${rowIndex}`]: true}"
      :style="model.style">
    <slot></slot>
  </tr>
</template>

<style scoped>
</style>

<script>
export default {
  name: 'row',
  props: {
    model: {
      type: Object,
      required: true
    },
    rowIndex: {
      type: Number
    }
  }
}
</script>
<template>
  <svg ref="ins"
       version="1.1"
       xmlns="http://www.w3.org/2000/svg"
       :width="width"
       :height="height">
    <rect width="100%"
          height="100%"
          :fill="fill" />
    <slot />
  </svg>
</template>

<script>
import { svgToImage } from '../../utils/image'

export default {
  name: 'VueSvgCanvas',
  props: {
    width: { type: Number, default: 600 },
    height: { type: Number, default: 600 },
    fill: { type: String, default: '#afafaf' }
  },
  methods: {
    toImage () {
      const { ins } = this.$refs
      if (ins) {
        return svgToImage(ins)
      }
      return undefined
    }
  }
}
</script>
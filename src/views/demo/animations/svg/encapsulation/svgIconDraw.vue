<template>
  <div class="padding__small">
    <div>Svg Icon 绘制</div>
    <div class="margin-top__small">
      <div ref="container"
           class="padding__small"
           style="background-color: #3f3f3f"
           :style="{ width: width + 'px', height: height + 'px'}"></div>
    </div>
  </div>
</template>

<script>
import { ColorEnum, ModelStatusEnum } from './ts/constants'
import { SvgModel, SvgLineModel, SvgRectModel, SvgRectPathModel } from './ts/index'
import SvgCanvasModel from './ts/models/components/Canvas'
import VueSvgCanvas from './vue/canvas.vue'
import VueSvgRect from './vue/rect.vue'
import { MeshGraph } from './ts/plugins/graph'
import { flatten } from 'lodash'

export default {
  name: 'SvgIconDrawDemo',
  data () {
    return {
      width: 1024,
      height: 1024,
      canvas: null,
      models: []
    }
  },
  mounted () {
    this.init()
    window.models = this.models
  },
  destroyed () {
    this.canvas && this.canvas.destroy()
    this.canvasGraph = null
    this.models.forEach(model => {
      model && model.destroy()
    })
    this.line && this.line.destroy()
  },
  methods: {
    init () {
      let canvas = new SvgCanvasModel({
        width: this.width,
        height: this.height,
        fill: "#efefef",
        onClick: this.clickModel
      })
      canvas.init()
      this.canvas = canvas
      this.$refs.container.appendChild(canvas.$el)

      let line = new SvgLineModel({
        x1: 846,
        y1: 60,
        x2: 846,
        y2: 964,
        border: '36 solid currentColor',
      })
      line.init()
      this.canvas.appendChild(line)
      this.models.push(line)

      let model = new SvgRectModel({
        x: 314,
        y: 140,
        width: 400,
        height: 300,
        border: '36 solid currentColor',
        borderRadius: '5',
        fill: 'currentColor', // '#233661'
        onDragend: this.onDragend
      })
      model.init()
      canvas.appendChild(model)
      this.models.push(model)

      model = new SvgRectModel({
        x: 114,
        y: 584,
        width: 600,
        height: 300,
        border: '36 solid currentColor',
        borderRadius: '5',
        fill: 'transparent', // '#233661'
        onDragend: this.onDragend
      })
      model.init()
      canvas.appendChild(model)
      this.models.push(model)
    },
  }
}
</script>
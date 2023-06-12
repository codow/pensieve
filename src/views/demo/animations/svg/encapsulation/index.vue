<template>
  <div class="padding__small">
    <div class="margin__small">
      Svg模型封装实验
      <div class="padding__small">
        <div style="width: 200px; height: 200px; border: 10px solid red; border-radius: 30px; box-sizing: border-box;">我是内容</div>
      </div>
      <el-form inline>
        <el-form-item label="线绘制">
          <el-input v-model="points"
                    style="width: 400px;">
          </el-input>
        </el-form-item>
        <el-form-item label="显示连线图示">
          <el-switch v-model="showGraphMap"></el-switch>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary"
                     @click="onLineGenerateClick">生成线</el-button>
          <el-button type="primary"
                     icon="el-icon-save"
                     @click="save">保存</el-button>
        </el-form-item>
      </el-form>
      <div ref="container"
           class="padding__small"></div>
      <div class="padding__small">
        <el-form :model="formData"
                 inline>
          <el-form-item label="宽度"><el-input-number v-model="formData.width"
                             placeholder=""></el-input-number></el-form-item>
          <el-form-item label="高度"><el-input-number v-model="formData.height"
                             placeholder=""></el-input-number></el-form-item>
          <el-form-item label="颜色"><el-color-picker v-model="formData.fill" /></el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="toImage('canvas')">转图片</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="padding__small">
        <VueSvgCanvas ref="canvas">
          <VueSvgRect :width="formData.width"
                      :height="formData.height"
                      :fill="formData.fill"
                      draggable
                      @dragstart.native="onDragstart"></VueSvgRect>
        </VueSvgCanvas>
      </div>

      <div class="padding__small">
        <img :src="previewImage" />
      </div>
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

const onBodyClick = function (e) {
  window.clickEvent = e
}

document.body.addEventListener('click', onBodyClick)

export default {
  name: 'SvgEncapsulationDemo',
  components: {
    VueSvgCanvas,
    VueSvgRect
  },
  data () {
    return {
      canvas: null,
      canvasGraph: null,
      points: "[200, 100, 700, 300]",
      showGraphMap: false,
      line: null,
      models: [],
      formData: {
        width: undefined,
        height: undefined,
        fill: undefined,

      },
      previewImage: null
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
        width: 800,
        height: 400,
        fill: "#efefef",
        onClick: this.clickModel
      })
      canvas.init()
      this.canvas = canvas
      this.$refs.container.appendChild(canvas.$el)
      let model = new SvgRectModel({
        x: 534,
        y: 254,
        width: 160,
        height: 64,
        border: '2 solid #2461ef',
        borderRadius: '5',
        fill: '#ffffff', // '#233661'
        onDragend: this.onDragend
      })
      model.init()
      canvas.appendChild(model)
      this.models.push(model)
      let options = {
        x: 166,
        y: 119,
        width: 160,
        height: 64,
        border: '2 solid transparent',
        borderRightSize: '4',
        borderBottomSize: '6',
        borderLeftSize: '8',
        borderRadius: '10 20 5 0',
        fill: '#ffffff', // '#233661'
        headerFill: '#3662ec',
        "selected.fill": '#233661',
        "selected.headerFill": '#233661',
        "selected.borderColor": '#2461ef',
        "debugger.headerFill": ColorEnum.Warn,
        "debugger.borderColor": ColorEnum.Warn,
        "debugger.borderType": "dashed",
        onClick: this.clickModel,
        onDragend: this.onDragend
      }
      model = new SvgRectPathModel(options)
      model.init()
      model.$el.style = "margin-left: 10px;"
      canvas.appendChild(model)
      this.models.push(model)

      model = new SvgRectPathModel({
        ...options,
        x: 140,
        y: 260,
        sideMode: 'multiple'
      })
      model.init()
      model.$el.style = "margin-left: 10px;"
      canvas.appendChild(model)
      this.models.push(model)

      this.createCanvasGraph()
    },
    createCanvasGraph () {
      // 创建图
      this.canvasGraph = new MeshGraph({
        x1: 0,
        y1: 0,
        x2: 800,
        y2: 400,
      }, this.models.map(model => {
        let { x = 0, y = 0, width = 0, height = 0 } = model.$options
        // 向外扩展10像素，避免挨得太近
        let margin = 0
        return {
          x1: x - margin,
          y1: y - margin,
          x2: x + width + margin,
          y2: y + height + margin
        }
      }))
      window.graph = this.canvasGraph
      console.log('canvasGraph', window.graph)
    },
    toImage (ref) {
      let canvas = this.$refs[ref]
      if (canvas) {
        this.previewImage = canvas.toImage()
      }
    },
    clickModel (model, event) {
      // console.log('点击图形', model, event, event.target)
      window.modelClickEvent = event
    },
    onDragend (model, e) {
      // console.log('拖拽结束', model)
      this.createCanvasGraph()
    },
    save () {
      console.log(JSON.stringify(this.canvas.toJSON()))
    },
    onLineGenerateClick () {
      let points = JSON.parse(this.points) || []
      points = this.canvasGraph.pathfindingByPoints({ x: points[0], y: points[1] }, { x: points[2], y: points[3] }, this.showGraphMap)
      points = points.map(item => [item.x, item.y])
      points = flatten(points)
      if (!this.line) {
        this.line = new SvgLineModel({
          points,
          border: '2 solid #2461ef',
        })
        this.line.init()
        this.canvas.appendChild(this.line)
      } else {
        this.line.setOptions({
          points
        })
      }
    }
  }
}
</script>
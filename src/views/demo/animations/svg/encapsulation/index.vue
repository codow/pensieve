<template>
  <div class="padding__small">
    <div class="margin__small">
      Svg模型封装实验
      <div class="padding__small">
        <div style="width: 200px; height: 200px; border: 10px solid red; border-radius: 30px; box-sizing: border-box;">我是内容</div>
      </div>
      <el-form>
        <el-form-item label=""><el-button type="primary"
                     icon="el-icon-save"
                     @click="save">保存</el-button></el-form-item>
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
import { SvgModel, SvgRectModel, SvgRectPathModel } from './ts/index'
import SvgCanvasModel from './ts/models/components/Canvas'
import VueSvgCanvas from './vue/canvas.vue'
import VueSvgRect from './vue/rect.vue'

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
    this.models.forEach(model => {
      model && model.destroy()
    })
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
      this.$refs.container.appendChild(canvas.$el)
      let model = new SvgRectModel({
        x: 20,
        y: 20,
        width: 160,
        height: 64,
        border: '2 solid #2461ef',
        borderRadius: '5',
        fill: '#ffffff' // '#233661'
      })
      model.init()
      canvas.appendChild(model)
      this.models.push(model)
      let options = {
        x: 20,
        y: 104,
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
        onClick: this.clickModel
      }
      model = new SvgRectPathModel(options)
      model.init()
      model.$el.style = "margin-left: 10px;"
      canvas.appendChild(model)
      this.models.push(model)

      model = new SvgRectPathModel({
        ...options,
        x: 20,
        y: 184,
        sideMode: 'multiple'
      })
      model.init()
      model.$el.style = "margin-left: 10px;"
      canvas.appendChild(model)
      this.models.push(model)
    },
    toImage (ref) {
      let canvas = this.$refs[ref]
      if (canvas) {
        this.previewImage = canvas.toImage()
      }
    },
    clickModel (model, event) {
      console.log('点击图形', model, event, event.target)
      window.modelClickEvent = event
    },
    onDragstart (e) {
      console.log('dragstart', e.target)
    },
    save () {
      console.log('this.models', this.models)
      let models = this.models.map(model => model.toJSON())
      console.log(JSON.stringify(models))
    }
  }
}
</script>
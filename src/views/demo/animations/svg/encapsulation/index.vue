<template>
  <div class="padding__small">
    <div class="margin__small">
      Svg模型封装实验
      <div class="padding__small">
        <div style="width: 200px; height: 200px; border: 10px solid red; border-radius: 30px; box-sizing: border-box;">我是内容</div>
      </div>
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
                      :fill="formData.fill"></VueSvgRect>
        </VueSvgCanvas>
      </div>

      <div class="padding__small">
        <img :src="previewImage" />
      </div>
    </div>
  </div>
</template>

<script>
import { SvgModel, SvgRectModel, SvgRectPathModel } from './ts/index'
import VueSvgCanvas from './vue/canvas.vue'
import VueSvgRect from './vue/rect.vue'

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
      let model = new SvgRectModel({
        width: 200,
        height: 200,
        border: '10 solid red',
        borderRadius: '30'
      })
      model.render()
      this.$refs.container.appendChild(model.$el)
      this.models.push(model)
      model = new SvgRectPathModel({
        width: 160,
        height: 64,
        border: '2 solid #2461ef',
        borderRadius: '5',
        fill: '#233661'
      })
      model.render()
      this.$refs.container.appendChild(model.$el)
      this.models.push(model)
    },
    toImage (ref) {
      let canvas = this.$refs[ref]
      if (canvas) {
        this.previewImage = canvas.toImage()
      }
    }
  }
}
</script>
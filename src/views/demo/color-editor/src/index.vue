<template>
  <div>
    <div>测试颜色</div>
    <div>
      <div>
        <el-form :model="colorForm"
                 label-position="right"
                 label-width="120px">
          <el-form-item label="红">
            <el-input v-model="colorForm.red"
                      placeholder="0~255"></el-input>
          </el-form-item>
          <el-form-item label="绿">
            <el-input v-model="colorForm.green"
                      placeholder="0~255"></el-input>
          </el-form-item>
          <el-form-item label="蓝">
            <el-input v-model="colorForm.blue"
                      placeholder="0~255"></el-input>
          </el-form-item>
          <el-form-item label="透明度">
            <el-input v-model="colorForm.opacity"
                      placeholder="0~1"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary"
                       @click="calcCssColorExpression">计算CSS颜色表达式</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-form label-position="right"
                 label-width="120px">
          <el-form-item label="CSS颜色表达式">
            <el-input v-model="cssColorExpression"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary">计算颜色值</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'demo-color-editor',

  data () {
    return {
      cssColorExpression: '',
      colorForm: {
        red: '',
        green: '',
        blue: '',
        opacity: ''
      }
    }
  },

  methods: {
    calcCssColorExpression () {
      // 取红绿蓝和透明度
      let red = this.colorForm.red
      let green = this.colorForm.green
      let blue = this.colorForm.blue
      let opacity = this.colorForm.opacity
      // 
      if (!isFinite(red) || !isFinite(green) || !isFinite(blue)) {
        this.cssColorExpression = ''
        return
      }
      if (opacity !== '' && opacity !== null && isFinite(opacity)) {
        this.cssColorExpression = `rgba(${red}, ${green}, ${blue}, ${opacity})`
      } else {
        red = new Number(+red).toString(16)
        green = new Number(+green).toString(16)
        blue = new Number(+blue).toString(16)
        this.cssColorExpression = `#${red}${green}${blue}`
      }
    }
  }
}
</script>